import { Component, Inject, Optional } from '@angular/core';
import { ProductService } from '../product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent {

  productForm: FormGroup;
  photoFile!: File;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditProductComponent>,
    private readonly prodService: ProductService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iProduct
  ) {
    this.productForm = this.formBuilder.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      preis: [this.data ? this.data.preis : '', Validators.required],
      beschreibung: [this.data ? this.data.beschreibung : '', Validators.required],
      foto: [this.data ? this.data.foto : ''],
      thumbnail: [this.data ? this.data.thumbnail : ''],
      lieferant: [this.data ? this.data.lieferant : null, Validators.required],
      lagerorte: [this.data ? this.data.lagerorte : [], Validators.required],
      bestellungen: [this.data ? this.data.bestellungen : []],
      datumHinzugefuegt: [this.data ? this.data.datumHinzugefuegt : ''],
      kategorie: [this.data ? this.data.kategorie : [], Validators.required],
      verfgbarkeit: [this.data ? this.data.verfgbarkeit : false],
      mindestmenge: [this.data ? this.data.mindestmenge : '', Validators.required],
      aktion: [this.data ? this.data.aktion : false],
      verkaufteAnzahl: [this.data ? this.data.verkaufteAnzahl : ''],
      wareneingang: [this.data ? this.data.wareneingang : []],
      warenausgang: [this.data ? this.data.warenausgang : []],
      mehrwehrsteuer: [this.data ? this.data.mehrwehrsteuer : '', Validators.required],
      promocje: [this.data ? this.data.promocje : []],
      reservation: [this.data ? this.data.reservation : []],
      bewertung: [this.data ? this.data.bewertung : []]
    });
  }


  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.photoFile = event.target.files[0];
    }
  }

  uploadPhoto() {
    if (this.photoFile) {
      this.prodService.uploadPhoto(this.photoFile);
    }
  }

  saveProduct() {
    if (this.productForm.valid) {
      const product: iProduct = this.productForm.value;
      if (!product.id) {
        this.prodService.createProduct(product);
      } else {
        this.prodService.updateProduct(product.id, product);
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
