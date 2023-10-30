import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationsService } from './variations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { MatTableModule } from '@angular/material/table';
import { iProduct } from 'src/app/model/iProduct';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateVariationComponent } from './create-variation/create-variation.component';
import { Observable, tap } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatInputModule } from '@angular/material/input';
import { HelperService, getUniqueSymbol } from 'src/app/helper/helper.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { iDelete } from 'src/app/model/iDelete';

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule, ErrorComponent, MatInputModule, MatIconModule, MatProgressBarModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationsComponent implements AfterViewInit {
  @Input() product!: iProduct;
  currentImage!: Blob;
  photoFile!: File;
  variationsSig = toSignal(this.service.variations$, { initialValue: []});
  selectedVariation: iProduktVariations = {} as iProduktVariations;
  productVarationsSig = toSignal(this.service.variations.asObservable(), { initialValue: []});
  columns : string[] = ['sk', 'name', 'val', 'val2','price', 'quanity', 'quanity_sold', 'del','hint', 'image'];
  send$ = [new Observable()];

  constructor (public readonly service: VariationsService, private dialog: MatDialog, public errorServi: ErrorService,
    public readonly helperService: HelperService) {}
  ngAfterViewInit(): void {
    this.service.variations.next(this.product.variations);
  }


  addVariation() {

    if(!this.selectedVariation.variations_name)
    return;

    this.selectedVariation.produkt = { id: this.product.id} as iProduct;
    this.selectedVariation.value = this.getProductVariationValue();
    this.selectedVariation.sku = this.product.sku+'_'+getUniqueSymbol()+this.selectedVariation.variations_name+'_'+this.selectedVariation.value;
    this.selectedVariation.price = 0.00;
    if(this.service.variations.value.length > 0 )
      this.selectedVariation.price = this.service.variations.value[0].price;

      this.selectedVariation.quanity = 0;
      this.selectedVariation.quanity_sold = 0;
    this.send$[-1] = this.service.create(this.selectedVariation);

  }

  addNeueVariation() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    conf.data = { prod: this.product };

    this.dialog.open(CreateVariationComponent, conf);
  }
  deleteVariation(sku: string) {
    this.send$[-1] = this.service.delete(sku);
  }
  uploadPhoto(element: iProduktVariations, index: number) {

    if (this.photoFile) {
      if(element.sku) {
        this.send$[index] = this.service.uploadPhoto(this.photoFile, element.sku, index).pipe(

          tap((act) => {
          if(act) {

            if(this.helperService.uploadProgersSig().signal > 99)
            {
              const tmp = act as unknown as { imageid: string };

              const items = this.service.variations.value;
              const index = items.findIndex((item) => element.sku === item.sku);
              const newItems = items.slice(0);
              newItems[index].image =  tmp.imageid;
              this.service.variations.next(newItems);
              this.service.images.update((items) => [...items, tmp.imageid]);
            }

          }
          return act;
        })
        );
      }
    }
  }

  cancelUpload() {
    this.service.resetFotoUpload();
    }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
        this.photoFile = event.target.files[0];
    }
  }
  deleteImage(variation: iProduktVariations, index: number) {

      const item: iDelete =  { produktid: variation.sku, fileid: variation.image};
      this.send$[index] = this.service.deleteImage(item).pipe(tap((res) => {
        if(res === 1) {
            const items = this.service.variations.value;
            const index = items.findIndex((tmp) => tmp.sku === variation.sku);
            if(!index)
              this.errorServi.newMessage('Produkt Variation mit gelöschte bild wurde nicht gefunden!');

          const newItems = items.slice(0);
          newItems[index].image = '';
          this.service.variations.next(newItems);
        }
      }))

  }
  changesInVariation(item: iProduktVariations) {
    const currentItems = this.service.variations.value;
    const index = currentItems.findIndex((item) => item.sku === item.sku);

    if(!index)
      return;

    const itemsNew = currentItems.slice(0);
    itemsNew[index] = item;
    this.service.variations.next(itemsNew);
  }
  private getProductVariationValue(): string {
    const items = this.service.variations.value.filter(
      (item) => item.variations_name === this.selectedVariation.variations_name
    );


    if(items.length < 10)
      return '0' + items.length;

    return items.length.toString();

  }
}



