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

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule, ErrorComponent, MatInputModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationsComponent implements AfterViewInit {
  @Input() product!: iProduct;
  variationsSig = toSignal(this.service.variations$, { initialValue: []});
  selectedVariation: iProduktVariations = {} as iProduktVariations;
  productVarationsSig = toSignal(this.service.variations.asObservable(), { initialValue: []});
  columns : string[] = ['sk', 'name', 'val', 'val2', 'hint', 'del', 'image'];
  send$ = new Observable();
  constructor (private readonly service: VariationsService, private dialog: MatDialog, public errorServi: ErrorService) {}
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
}

