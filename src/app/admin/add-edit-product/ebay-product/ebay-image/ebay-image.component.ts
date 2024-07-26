import { ChangeDetectionStrategy, Component, Input, output, Output, signal, WritableSignal} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { duration } from 'moment';
import { lastValueFrom } from 'rxjs';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';

@Component({
  selector: 'app-ebay-image',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './ebay-image.component.html',
  styleUrl: './ebay-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayImageComponent {
  @Input('image') image: string | undefined;
  currentImageLink  = signal<string | undefined>(undefined);
  imagelink = output<string>();
  currentImageSig = signal<Blob| undefined>(undefined);
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
  openFileInput(event: any) {
    const file:File = event.target.files[0];

    lastValueFrom(this.service.saveImageOnEbayServer(file)).then((res) => {
      if(res.UploadSiteHostedPicturesResponse) {
        this.imagelink.emit(res.UploadSiteHostedPicturesResponse.SiteHostedPictureDetails.FullURL);
        this.snackBar.open('Image Upload susccesfull', 'Ok', { duration : 2000 });
        this.currentImageLink.set(res.UploadSiteHostedPicturesResponse.SiteHostedPictureDetails.FullURL);
        this.currentImageSig.set(file);
      } else {
        this.snackBar.open(Object(res).message, 'Ok', { duration: 3000 });
      }
        
    })
    
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
}
