import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationsService } from '../variations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-variation',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule,
  MatButtonModule],
  templateUrl: './create-variation.component.html',
  styleUrls: ['./create-variation.component.scss']
})
export class CreateVariationComponent {

  variation: iProduktVariations = {} as iProduktVariations;
  form: FormGroup;
  send$ = new  Observable();
  constructor(private readonly service: VariationsService, @Inject(MAT_DIALOG_DATA) public data: { prod: iProduct, vari: iProduktVariations | undefined}, private readonly ref: MatDialogRef<CreateVariationComponent>,
  private fb : FormBuilder, private error: ErrorService ) {
    this.form = this.fb.group({
      sku: [ this.getSku(), Validators.required],
      variations_name: [data.vari ? data.vari.variations_name: '', Validators.required],
      hint: [ data.vari ? data.vari.hint : ''],
      value: [ data.vari ? data.vari.value: '', Validators.required],
      unit: [ data.vari ? data.vari.unit: '']
    });

    if(data.prod === undefined)
      this.error.newMessage('Produkt wurde nicht gefunden!');

  }
  abort() {
    this.ref.close();
  }
  save() {

      Object.assign(this.variation, this.form.value);
      this.variation.produkt = this.data.prod;
      this.send$ = this.service.create(this.variation);
  }
  getSku() {
    if(this.form && this.form.get('value'))
      return this.data.prod.sku+'_'+this.form.get('variations_name')?.getRawValue()+'_'+this.form.get('value')?.getRawValue();

    return this.data.prod.sku;
  }
  updateVariationSku() {
    this.form.patchValue({sku: this.getSku()});
  }
}
