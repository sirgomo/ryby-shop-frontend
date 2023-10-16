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

@Component({
  selector: 'app-create-variation',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule,
  MatButtonModule],
  templateUrl: './create-variation.component.html',
  styleUrls: ['./create-variation.component.scss']
})
export class CreateVariationComponent {
  produkt: iProduct | undefined = undefined;
  variation: iProduktVariations | undefined = undefined;
  form: FormGroup;
  constructor(private readonly service: VariationsService, @Inject(MAT_DIALOG_DATA) data: { prod: iProduct, vari: iProduktVariations | undefined}, private readonly ref: MatDialogRef<CreateVariationComponent>,
  private fb : FormBuilder, private error: ErrorService ) {
    this.form = this.fb.group({
      sku: [data.vari ? data.vari.sku : '', Validators.required],
      variations_name: [data.vari ? data.vari.variations_name: '', Validators.required],
      hint: [ data.vari ? data.vari.hint : ''],
      value: [ data.vari ? data.vari.value: '', Validators.required],
      unit: [ data.vari ? data.vari.unit: ''],
      image: [ data.vari? data.vari.image : '', Validators.required]
    });

    if(data.prod === undefined)
      this.error.newMessage('Produkt wurde nicht gefunden!');

    this.produkt = data.prod;
    this.variation = data.vari;
  }
  abort() {
    this.ref.close();
  }
  save() {
    console.log(this.form.value)
  }
}
