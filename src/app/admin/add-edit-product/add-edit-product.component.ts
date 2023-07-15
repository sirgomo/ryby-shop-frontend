import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { ProductService } from '../product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { iColor } from 'src/app/model/iColor';
import { LiferantsService } from '../liferants/liferants.service';
import { KategorieService } from '../kategories/kategorie.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iLieferant } from 'src/app/model/iLieferant';
import { iKategorie } from 'src/app/model/iKategorie';
import { HelperService } from 'src/app/helper/helper.service';
import { ErrorService } from 'src/app/error/error.service';
import { Observable, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProductComponent implements OnInit {


  productForm: FormGroup;
  currentImage!: Blob;
  photoFile!: File;
  images: string[] = [];
  color: iColor[] = [];
  liferantSignal = toSignal<iLieferant[], iLieferant[]>(this.liferantService.liferants$, { initialValue: [] });
  kategorySignal = toSignal<iKategorie[], iKategorie[]>(this.katService.kategorie$, { initialValue: []});
  act$ = new Observable();
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditProductComponent>,
    private readonly prodService: ProductService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iProduct,
    private liferantService: LiferantsService,
    private katService: KategorieService,
    public helperService: HelperService,
    public err: ErrorService,
    private sanitizer: DomSanitizer
  ) {
    this.productForm = this.formBuilder.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      preis: [this.data ? this.data.preis : '', Validators.required],
      artid: [this.data ? this.data.artid : '', Validators.required],
      beschreibung: [this.data ? this.data.beschreibung : '', Validators.required],
      foto: [this.data ? this.data.foto[0] : this.images],
      thumbnail: [this.data ? this.data.thumbnail : ''],
      lieferant: [this.data ? this.data.lieferant : null, Validators.required],
      lagerorte: [this.data ? this.data.lagerorte : [], Validators.required],
      bestellungen: [this.data ? this.data.bestellungen : []],
      datumHinzugefuegt: [this.data ? this.data.datumHinzugefuegt : Date.now()],
      kategorie: [this.data ? this.data.kategorie : [], Validators.required],
      verfgbarkeit: [this.data ? this.data.verfgbarkeit : false],
      mindestmenge: [this.data ? this.data.mindestmenge : '', Validators.required],
      aktion: [this.data ? this.data.aktion : false],
      verkaufteAnzahl: [{ value:  this.data ? this.data.verkaufteAnzahl : '',  disabled: true } ],
      wareneingang: [this.data ? this.data.wareneingang : []],
      warenausgang: [this.data ? this.data.warenausgang : []],
      mehrwehrsteuer: [this.data ? this.data.mehrwehrsteuer : '', Validators.required],
      promocje: [this.data ? this.data.promocje : []],
      reservation: [this.data ? this.data.reservation : []],
      bewertung: [this.data ? this.data.bewertung : []]
    });
  }
  ngOnInit(): void {
    if(this.data) {
      this.productForm.patchValue(this.data);
      this.images = JSON.parse( this.data.foto);
      this.color = JSON.parse(this.data.color);
    }
  }


  onFileChange(event: any) {

    if (event.target.files && event.target.files.length) {
        this.photoFile = event.target.files[0];
    }
  }

  uploadPhoto() {
    if (this.photoFile) {
     this.act$ = this.prodService.uploadPhoto(this.photoFile).pipe(tap((res) => {
      if(res) {
        const tmp = res as unknown as { imageid: string };
        this.images.push(tmp.imageid);
        this.productForm.get('foto')?.patchValue(this.images);
        this.getImage(tmp.imageid);
        console.log(tmp.imageid);
      }
     }));
    }
  }
  cancelUpload() {
    if(this.images.length > 0)
    this.getImage(this.images[this.images.length -1]);


    this.prodService.resetFotoUpload();
    }

  saveProduct() {
    if (this.productForm.valid) {
      const product: iProduct = this.productForm.value;
      product.foto = JSON.stringify(this.images);
      product.color = JSON.stringify(this.color);
      if (!product.id) {
      this.act$ = this.prodService.createProduct(product);
      } else {
      this.act$ = this.prodService.updateProduct(product.id, product);
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
  addColor(){
    const color: iColor = {
      id: this.color.length  > 9 ? 'farbe ' + (this.color.length +1) : 'farbe 0' + (this.color.length +1),
      menge: 0
    };
    this.color.push(color);
  }
  removeColor(){
    if(this.color.length > 0)
      this.color.splice(this.color.length -1, 1);
  }
  getImage(id: string) {

    this.act$ = this.prodService.getImage(id).pipe(tap((res) => {
     this.currentImage = res;
      console.log(res);
    }));
  }
  getSafeImageData() {
    if (this.currentImage) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.currentImage));
    }
    return '';
  }
}
