import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
import { Observable, of} from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatInputModule } from '@angular/material/input';
import { HelperService, getUniqueSymbol } from 'src/app/helper/helper.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageComponent } from '../image/image.component';


@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule, ErrorComponent, MatInputModule,
    MatIconModule, ImageComponent],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationsComponent implements AfterViewInit {
  @Input() product!: iProduct;
  currentImage!: Blob;

  variationsSig = toSignal(this.variationService.variations$, { initialValue: []});
  selectedVariation: iProduktVariations = {} as iProduktVariations;
  productVarationsSig = toSignal(this.variationService.variations.asObservable(), { initialValue: []});
  columns : string[] = ['sk', 'name', 'val', 'val2','price', 'pricebb', 'quanity', 'quanity_sold','at_once', 'del','hint', 'image'];
  send$ = [new Observable()];

  constructor (public readonly variationService: VariationsService, private dialog: MatDialog, public errorServi: ErrorService,
    public readonly helperService: HelperService) {}
  ngAfterViewInit(): void {
    this.variationService.variations.next(this.product.variations);
  }


  addVariation() {

    if(!this.selectedVariation.variations_name)
    return;

    this.selectedVariation.produkt = { id: this.product.id} as iProduct;
    this.selectedVariation.value = this.getProductVariationValue();
    this.selectedVariation.sku = this.product.sku+'_'+getUniqueSymbol()+this.selectedVariation.variations_name+'_'+this.selectedVariation.value;
    this.selectedVariation.price = 0.00;
    if(this.variationService.variations.value.length > 0 )
      this.selectedVariation.price = this.variationService.variations.value[0].price;

      this.selectedVariation.quanity = 0;
      this.selectedVariation.quanity_sold = 0;
    this.send$[-1] = this.variationService.create(this.selectedVariation);

  }

  addNeueVariation() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    conf.data = { prod: this.product };

    this.dialog.open(CreateVariationComponent, conf);
  }
  deleteVariation(sku: string) {
    this.send$[-1] = this.variationService.delete(sku);
  }





  changesInVariation(item: iProduktVariations) {
    const currentItems = this.variationService.variations.value;
    const index = currentItems.findIndex((item) => item.sku === item.sku);

    if(index === -1)
      return;

    const itemsNew = currentItems.slice(0);
    itemsNew[index] = item;
    this.variationService.variations.next(itemsNew);
  }
  private getProductVariationValue(): string {
    const items = this.variationService.variations.value.filter(
      (item) => item.variations_name === this.selectedVariation.variations_name
    );


    if(items.length < 10)
      return '0' + items.length;

    return items.length.toString();

  }
}



