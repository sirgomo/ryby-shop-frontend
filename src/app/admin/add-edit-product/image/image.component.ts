import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationsService } from '../variations/variations.service';
import { HelperService } from 'src/app/helper/helper.service';
import { Observable, tap } from 'rxjs';
import { iDelete } from 'src/app/model/iDelete';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatIconModule, MatProgressBarModule, MatInputModule, MatButtonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  @Input('element') element: any;
  @Output('send') send: EventEmitter<string> = new EventEmitter();
  constructor (private readonly variationService: VariationsService, public readonly helperService: HelperService, public readonly errorService: ErrorService) {}
  photoFile!: File;
  send$ = new Observable<any>();
  del$ = new Observable<any>();
  uploadPhoto(element: iProduktVariations | iProduct) {

    if (this.photoFile) {
      if(element.sku && !this.isElement(element) ) {
        this.send$ = this.variationService.uploadPhoto(this.photoFile, element.sku).pipe(

          tap((act) => {

          if(act) {

            if(this.helperService.uploadProgersSig() > 99 || this.helperService.uploadProgersSig() === 0  )
            {
              const tmp = act as unknown as { imageid: string };


              const items = this.variationService.variations.value;
              const index = items.findIndex((item) => element.sku === item.sku);
              const newItems = items.slice(0);
              newItems[index].image =  tmp.imageid;
              this.variationService.variations.next(newItems);
              this.variationService.images.update((items) => [...items, tmp.imageid]);
            }

          }
          return act;
        })
        );
      } else if (this.isElement(element)) {
        this.send$ = this.variationService.uploadPhoto(this.photoFile, element.sku).pipe(
          tap((act) => {
            if(act) {
              if(this.helperService.uploadProgersSig() > 99 || this.helperService.uploadProgersSig() === 0  )
              {
                const tmp = act as unknown as { imageid: string };
                element.produkt_image = tmp.imageid;
                this.send.emit(tmp.imageid);
              }
            }
            return act;
          })
        );
      }
    }
  }
 isElement (element: any ) : element is iProduct {
   return element.produkt_image !== undefined;
 }

  cancelUpload() {
    this.variationService.resetFotoUpload();
    }
    deleteImage(variation: any) {

      const item: iDelete =  { produktid: variation.sku, fileid: variation.image};
      if(variation.produkt_image) {
        item.product = true;
        item.fileid = variation.produkt_image;
      }


      this.del$ = this.variationService.deleteImage(item).pipe(tap((res) => {
        if(res === 1) {
            const items = this.variationService.variations.value;
            const index = items.findIndex((tmp) => tmp.sku === variation.sku);
            if(index === -1 && !this.isElement(variation)) {
              this.errorService.newMessage('Produkt Variation mit gelöschte bild wurde nicht gefunden!');
              return
            }
            //check if ivariation or iproduct
            if(!this.isElement(variation)) {
              const newItems = items.slice(0);
              newItems[index].image = '';
              this.variationService.variations.next(newItems);
            } else {
              this.send.emit('deleted');
            }
        }
      }))

  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
        this.photoFile = event.target.files[0];
    }
  }
}
