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
import { Observable } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatInputModule } from '@angular/material/input';
import { HelperService } from 'src/app/helper/helper.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  columns : string[] = ['sk', 'name', 'val', 'val2','price', 'quanity', 'quanity_sold', 'del','hint', 'thumb', 'image'];
  send$ = new Observable();
  constructor (private readonly service: VariationsService, private dialog: MatDialog, public errorServi: ErrorService,
    public readonly helperService: HelperService) {}
  ngAfterViewInit(): void {
    this.service.variations.next(this.product.variations);
  }


  addVariation() {

    if(!this.selectedVariation.variations_name)
    return;

    this.selectedVariation.produkt = { id: this.product.id} as iProduct;
    this.selectedVariation.value = this.productVarationsSig().length.toString();
    this.selectedVariation.sku = this.product.sku+'_'+this.selectedVariation.variations_name+'_'+this.selectedVariation.value;
    this.send$ = this.service.create(this.selectedVariation);

  }
  addNeueVariation() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '500px';
    conf.height = '500px';
    conf.data = { prod: this.product };

    this.dialog.open(CreateVariationComponent, conf);
  }
  deleteVariation(sku: string) {
    this.send$ = this.service.delete(sku);
  }
  uploadPhoto() {
    if(!this.product)
      return;
    if (this.photoFile) {
      if(this.product.id) {
     /*   this.send$ = this.service.uploadPhoto(this.photoFile, this.data.id).pipe(

          tap((act) => {
          if(act) {

            if(this.helperService.uploadProgersSig() > 99)
            {
              const tmp = act as unknown as { imageid: string };
              this.images.push(tmp.imageid);
              this.productForm.get('foto')?.patchValue(this.images);
              this.snackBar.open('Image wurde gespiechert', '', { duration: 2000})
              this.getImage(this.images[this.images.length-1]);
            }

          }
          return act;
        })
        );*/
      }
    }
  }

  cancelUpload() {
   // if(this.images.length > 0)
   // this.getImage(this.images[this.images.length -1]);


    this.service.resetFotoUpload();
    }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
        this.photoFile = event.target.files[0];
    }
  }
  deleteImage(id: string) {
   /* if(this.data && this.data.id !== undefined) {
      const item: iDelete =  { produktid: this.data.id, fileid: id};
      this.send$ = this.service.deleteImage(item).pipe(tap((res) => {
        if(res === 1) {
          const index = this.images.findIndex((tmp) => tmp === item.fileid);
          this.images.splice(index, 1);
          this.productForm.get('foto')?.patchValue(this.images);
          if(this.images.length > 0)
            this.getImage(this.images[0]);
        }
      }))
    }*/
  }
}

