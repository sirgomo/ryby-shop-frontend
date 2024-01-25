import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Optional, signal } from '@angular/core';
import { ProductService } from '../product/product.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { LiferantsService } from '../liferants/liferants.service';
import { KategorieService } from '../kategories/kategorie.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iLieferant } from 'src/app/model/iLieferant';
import { iKategorie } from 'src/app/model/iKategorie';
import { HelperService, getUniqueSymbol } from 'src/app/helper/helper.service';
import { ErrorService } from 'src/app/error/error.service';
import { Observable, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { iAktion } from 'src/app/model/iAktion';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { iEan } from 'src/app/model/iEan';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VariationsComponent } from './variations/variations.component';
import { VariationsService } from './variations/variations.service';
import { environment } from 'src/environments/environment';
import { ImageComponent } from './image/image.component';
import { ShippingCostService } from '../shipping-cost/shipping-cost.service';


@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, MatDatepickerModule],
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
  MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatTabsModule, MatProgressBarModule,
   MatProgressSpinnerModule, MatInputModule, MatCheckboxModule, VariationsComponent, ImageComponent]
})
export class AddEditProductComponent implements OnInit, OnDestroy {


  productForm: FormGroup;
  currentImage!: Blob;
  images = this.variationService.images;
  actionsSig = signal<iAktion[]>([]);
  liferantSignal = toSignal<iLieferant[], iLieferant[]>(this.liferantService.liferants$, { initialValue: [] });
  kategorySignal = toSignal<iKategorie[], iKategorie[]>(this.katService.kategorie$, { initialValue: []});
  shippingCost = this.shippingService.getAllShipping();
  act$ = new Observable().pipe(startWith(null));
  create$ = new Observable().pipe(startWith({}));
  getFoto$ = new Observable().pipe(startWith(null));

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly dialogRef: MatDialogRef<AddEditProductComponent>,
    private readonly prodService: ProductService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iProduct,
    private readonly liferantService: LiferantsService,
    private readonly katService: KategorieService,
    public readonly helperService: HelperService,
    public readonly err: ErrorService,
    private readonly sanitizer: DomSanitizer,
    private readonly dpipe: DatePipe,
    public readonly snackBar: MatSnackBar,
    private readonly variationService: VariationsService,
    private readonly shippingService: ShippingCostService,
  ) {
    this.productForm = this.formBuilder.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      sku: [this.data ? this.data.sku : this.getRandomSku()],
      artid: [this.data ? this.data.artid : '', Validators.required],
      beschreibung: [this.data ? this.data.beschreibung : '', Validators.required],
      lieferant: [this.data ? this.data.lieferant : {} as iLieferant, Validators.required],
      lagerorte: [this.data ? this.data.lagerorte : []],
      bestellungen: [this.data ? this.data.bestellungen : []],
      datumHinzugefuegt: [this.data ? this.data.datumHinzugefuegt : Date.now()],
      kategorie: [this.data ? this.data.kategorie : [], Validators.required],
      verfgbarkeit: [{value : this.data ? this.data.verfgbarkeit : 0, disabled: true }],
      product_sup_id: [this.data ? this.data.product_sup_id: ''],
      wareneingang: [this.data ? this.data.wareneingang : []],
      mehrwehrsteuer: [this.data ? this.data.mehrwehrsteuer : '', Validators.required],
      promocje: [this.data ? this.data.promocje : []],
      bewertung: [this.data ? this.data.bewertung : []],
      eans: this.formBuilder.array<iEan>([]),
      produkt_image: [this.data ? this.data.produkt_image: ''],
      shipping_costs: [this.data ? this.data.shipping_costs : []],
    });
  }
  ngOnDestroy(): void {
    this.data = {} as iProduct;
  }
  ngOnInit(): void {
    this.variationService.images.set([]);
    if(this.data && this.data.id) {

      this.create$ = this.prodService.getProductById(this.data.id).pipe(map((res) => {
        if(res.id) {

          this.productForm.patchValue(res);

          if(res.eans && res.eans.length > 0) {
            for (let i = 0; i < res.eans.length; i++) {
              const tmp = this.formBuilder.group({
                id: [res.eans[i].id],
                eanCode: [res.eans[i].eanCode , Validators.required],
              });
              this.ean.push(tmp);
            }
          }
          const images = [];
          for(let i = 0; i < res.variations.length; i++) {
              if(res.variations[i].image && res.variations[i].image.length > 2)
                images.push(res.variations[i].image);
          }
          this.variationService.images.set(images);
          if(res.produkt_image && res.produkt_image.length > 5)
            this.images().unshift(res.produkt_image);

           if(this.images().length > 0)
            this.getImage(this.images()[0]);



            this.data.variations = res.variations;
            this.data.verfgbarkeit = res.verfgbarkeit;

        }
        return res;
       }));

    }
  }
  //emit image in image component or delete image when image is deleted
  emitImage(image: string) {
      if(image === 'deleted')  {
        this.images().splice(0, 1);
        this.data.produkt_image = '';
        if(this.images().length > 0)
        this.getImage(this.images()[0]);
        return;
      }

    this.images().unshift(image);
    this.getImage(image);
  }
  get ean() {
    return this.productForm.get('eans') as FormArray;
  }
  addEan() {
    const tmp = this.formBuilder.group({
      id: undefined,
      eanCode: ['', Validators.required]
    });
    this.ean.push(tmp);
  }
  removeEan(index: number) {
    const itemid : number = this.ean.value[index].id;
    if(itemid === null) {
      this.ean.removeAt(index);
      return;
    }


    let tmp$ = of(itemid);

    this.create$ = combineLatest([this.act$.pipe(startWith(null)), tmp$]).pipe(
    switchMap(([act, tmp]) => this.prodService.deleteEanById(tmp)),
    map((res) => {
      if (Object(res).affected === 1) {
        this.ean.removeAt(index);
        this.snackBar.open('Ean wurde entfernt',  'Ok', { duration: 2000 });
      }
      return res;
    }))

  }




  saveProduct() {
    if (this.productForm.valid) {
      const product: iProduct = {} as iProduct;
      Object.assign(product, this.productForm.value)

      if(this.variationService.variations.value.length > 0)
        product.variations = this.variationService.variations.value;


      if(!product.verfgbarkeit )
        product.verfgbarkeit = 0;

      if(this.data && this.data.verfgbarkeit)
        product.verfgbarkeit = this.data.verfgbarkeit;

      const curDate =  this.dpipe.transform(this.productForm.get('datumHinzugefuegt')?.getRawValue(), 'yyyy-MM-dd');

      if(curDate)
        product.datumHinzugefuegt = curDate;
      if(this.data)
        product.id = this.data.id;


      if (!product.id) {
      this.create$ = this.prodService.createProduct(product).pipe(tap((res) => {
        if(res.id) {
          this.snackBar.open('Das Produkt wurde hinzugefügt', '', {duration: 1500 });
          this.data = {} as iProduct;
          this.dialogRef.close();
          return res;
        }

        this.snackBar.open('Etwas ist falschgelaufen, Produkt wurde nicht hinzugefügt', '', {duration: 3000 });
        return res;
      }));
      } else {
       // product.verfgbarkeit = this.productForm.get('verfgbarkeit')?.getRawValue() == 1 ? true : false;
      this.create$ = this.prodService.updateProduct(product.id, product).pipe(tap((res) => {
        if(res && res.id && isFinite(res.id)) {
          this.snackBar.open('Die Änderungen wurden gespeichert', '', {duration: 1500 });
          return res;
        }

        this.snackBar.open('Etwas ist scheifgelaufen, die änderungen wurden nicht gespeichert', '', {duration: 3000 });
        return res;
      }));
      }
    } else {
      this.snackBar.open('Das Artikel Formular ist fehlerhaft ausgefüllt.', 'OK', { duration: 2000 });
    }

  }

  cancel() {
    this.data = {} as iProduct;
    this.dialogRef.close();
  }

  getImage(id: string) {

    this.getFoto$ =  this.variationService.getImage(id).pipe(tap((res) => {
     this.currentImage = res;
     return res;
    }));
  }
  getSafeImageData() {
    if (this.currentImage) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.currentImage));
    }
    return '';
  }
  getSelected(o1: any, o2: any) {
    if(!o1 || !o2) return false;
    return (o1.id == o2.id);
  }
  getRandomSku(): string {

    let sku = '';
    for(let i = 0; i < environment.minskulength; i++) {
      sku += getUniqueSymbol();
    }
    return sku;
  }
}


