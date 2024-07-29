import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, output, Output, signal, WritableSignal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom, map, Subscription, tap } from 'rxjs';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iEbayImageResponse } from 'src/app/model/ebay/item/iEbayImageResponse';

@Component({
  selector: 'app-ebay-image',
  standalone: true,
  imports: [MatIconModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './ebay-image.component.html',
  styleUrl: './ebay-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayImageComponent implements OnDestroy{
  @Input('image') image: string | undefined;
  currentImageLink  = signal<string | undefined>(undefined);
  imagelink = output<string>();
  currentImageSig = signal<Blob| undefined>(undefined);
  uploadProgress = signal<number | undefined>(undefined);
  uploadSub : Subscription | undefined;
  isUploadingImage = signal(false);
  
  constructor(private readonly service: EbayInventoryService, private readonly snackBar: MatSnackBar, private readonly sanitizer: DomSanitizer ) {
    if(this.image) {
      this.currentImageLink.set(this.image);
      lastValueFrom(this.service.getImageFromEbay(this.image)).then((res) => {
        console.log(res);
        if(!Object(res).message)
          this.snackBar.open(Object(res).message, 'Ok', { duration: 3000 });
        else
          this.currentImageSig.set(res as Blob);
      })
    }
  }
  ngOnDestroy(): void {
      this.reset();
  }
  openFileInput(event: any) {
    const file:File = event.target.files[0];
    this.isUploadingImage.set(true);
    this.uploadSub = this.service.saveImageOnEbayServer(file).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Sent) {
          const progress = Math.round((100 * event?.loaded) / event?.total);
          this.uploadProgress.set(progress > 0 ? progress : 5);
        } else if (this.isEbayImageResponse(event.body)) {
          if(event.body.UploadSiteHostedPicturesResponse) {
            this.imagelink.emit(event.body.UploadSiteHostedPicturesResponse.SiteHostedPictureDetails.FullURL);
            this.snackBar.open('Image Upload susccesfull', 'Ok', { duration : 2000 });
            this.currentImageLink.set(event.body.UploadSiteHostedPicturesResponse.SiteHostedPictureDetails.FullURL);
            this.currentImageSig.set(file);
          }
        }
      },
      error: (err : any) => {
        this.snackBar.open(Object(err).message ? Object(err).message: 'Upload aborted...', 'Ok', { duration: 3000 });
        this.uploadProgress.set(undefined);
        this.isUploadingImage.set(true);
      },
      complete: (() => {
        this.reset();
      })
    })
  }
  isEbayImageResponse(res : any) : res is iEbayImageResponse {
    if(!res)
      return false;

    return (res as iEbayImageResponse).UploadSiteHostedPicturesResponse !== undefined;
  }
  getSafeImageData() {
    if (this.currentImageSig()) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.currentImageSig() as Blob));
    }
    return '';
  }
  setCurrentImage(image: Blob) {
    this.currentImageSig.set(image);
  }
  cancelUpload() {

      this.reset();
    }
  
  reset() {
      this.uploadProgress.set(undefined);
      this.uploadSub?.unsubscribe();
      this.isUploadingImage.set(true);
    }
}
