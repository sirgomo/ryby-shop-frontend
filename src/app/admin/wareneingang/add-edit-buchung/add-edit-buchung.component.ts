import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { WareneingangService } from '../wareneingang.service';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { LiferantsService } from '../../liferants/liferants.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { ArtikelListComponent } from '../artikel-list/artikel-list.component';
import { ArtikelGebuchtComponent } from '../artikel-gebucht/artikel-gebucht.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { toSignal } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-add-edit-buchung',
  templateUrl: './add-edit-buchung.component.html',
  styleUrls: ['./add-edit-buchung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  standalone: true,
  imports: [ MatIconModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSelectModule, ErrorComponent,
     MatDatepickerModule, MatTabsModule, ArtikelListComponent, ArtikelGebuchtComponent, CommonModule, MatButtonModule, MatCheckboxModule,
    MatInputModule]
})
export class AddEditBuchungComponent implements OnInit{
  products: iWareneingangProduct[] = [];
  warenEingangForm: FormGroup;
  act$ = new Observable();
  liferants$ = this.lieferants.liferants$;
  warehousesSig = toSignal(this.warehaouses.warehouses$);
  productQuanitySig = this.warenService.currentProductsInBuchungSig;

  constructor (private readonly dialRef: MatDialogRef<AddEditBuchungComponent>,
    private readonly warenService: WareneingangService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iWarenEingang,
    private readonly fb: FormBuilder,
    public err: ErrorService,
    private readonly lieferants: LiferantsService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly warehaouses: WarehouseService
    ) {
      this.warenEingangForm =  this.fb.group({
        id: [data?.id || null],
        lieferant: [data?.lieferant.id || null, Validators.required],
        empfangsdatum: [data?.empfangsdatum || new Date(Date.now()), Validators.required],
        rechnung: [data?.rechnung || null, Validators.required],
        lieferscheinNr: [data?.lieferscheinNr || null ],
        datenEingabe: [{ value:  data?.datenEingabe || null, disabled: true }],
        gebucht: [data?.gebucht || false],
        eingelagert: [{value: data?.eingelagert || false, disabled: true }],
        shipping_cost: [data?.shipping_cost || 0],
        remarks: [data?.remarks || ''],
        other_cost: [data?.other_cost || 0],
        location: [data?.location?.id || null, Validators.required],
        wahrung: [{value: data?.wahrung || 'EUR', disabled: true}],
        wahrung2: [data?.wahrung2 || 'EUR'],
        wahrung_rate: [data?.wahrung_rate || '1.0000'],
        shipping_cost_eur: [{ value: data?.shipping_cost_eur || 0, disabled: true}],
        other_cost_eur: [{value: data?.other_cost_eur || 0, disabled: true}],
      });
    }

  ngOnInit(): void {
    this.warenService.lieferantIdSig.set(0);
    this.warenService.currentWarenEingangSig.set(this);
    this.warenService.currentProductsInBuchungSig.set([]);

    if(this.data && this.data.id)
      this.act$ = this.warenService.getWareneingangBuchungbeiId(this.data.id).pipe(tap((res) => {
          if(res.id) {
            res.shipping_cost_eur = this.getValueinEuro(res.shipping_cost);
            res.other_cost_eur = this.getValueinEuro(res.other_cost);
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
            this.warenEingangForm.get('location')?.patchValue(res.location.id);
            if(res.lieferant.id)
            this.warenService.lieferantIdSig.set(res.lieferant.id)

           this.warenService.currentProductsInBuchungSig.set( res.products);

          }
      }))
  }



  saveGoodsReceipt() {
    if (this.warenEingangForm.valid) {
      const buchung: iWarenEingang = this.warenEingangForm.value;

      if(this.products.length > 1)
        buchung.products = this.products;
        const eD = this.datePipe.transform(this.warenEingangForm.get('empfangsdatum')?.getRawValue(), 'yyyy-MM-dd HH:mm:ss');
        if(eD)
        buchung.empfangsdatum =  eD;

        const buchungs_Datum = this.datePipe.transform(new Date(Date.now()).toISOString(), 'yyyy-MM-dd HH:mm:ss');
        if(this.warenEingangForm.get('gebucht')?.getRawValue() == true && buchungs_Datum)
        buchung.datenEingabe = buchungs_Datum;
      if(this.warehousesSig() !== undefined)
        buchung.location = this.warehousesSig()!.filter((tmo) => tmo.id == this.warenEingangForm.get('location')?.getRawValue())[0];
        buchung.other_cost_eur = this.getValueinEuro(buchung.other_cost);
        buchung.shipping_cost_eur = this.getValueinEuro(buchung.shipping_cost);
        if(!this.data) {
        this.act$ = this.warenService.createWareneingangBuchung(buchung).pipe(
          tap((res) => {
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('id')?.patchValue(res.id);
            this.data = res;
            if(res.lieferant.id) {
              this.warenService.lieferantIdSig.set(res.lieferant.id)
              this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
              this.warenEingangForm.get('location')?.patchValue(res.location.id);
            }


            this.snackBar.open('Die buchung wurde gespeichert', ' Ok', { duration: 2000 });
            return res;
          })
        )
      } else {
        this.act$ = this.warenService.updateWareneingangBuchung(buchung).pipe(
          tap((res) => {
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
            this.warenEingangForm.get('location')?.patchValue(res.location.id);
            this.data = res;
            this.snackBar.open('Die buchung wurde gespeichert', ' Ok', { duration: 3000 });
            if(res.lieferant.id)
            this.warenService.lieferantIdSig.set(res.lieferant.id);

            return res;
          })
        )
      }
    }
  }
  closeGoodsReceipt() {
    this.dialRef.close();
  }
  SaveReceiptCompletely() {


      if(window.confirm('Buchen ?')) {
        this.warenEingangForm.get('datenEingabe')?.patchValue(this.datePipe.transform(new Date( Date.now()).toISOString(), 'yyyy-MM-dd'));
        this.saveGoodsReceipt();
      }
      this.warenEingangForm.get('gebucht')?.setValue(false);


  }
  onSelectionChange(liferantId: number) {
   this.warenService.lieferantIdSig.set(liferantId);
  }

  getItemsData() {
    let quanity = 0;
    let price = 0;
    let tax = 0;
    if(this.warenService.currentProductsInBuchungSig().length === 0)
    return { quanity, price, tax };

    for (let i = 0; i < this.warenService.currentProductsInBuchungSig().length; i++) {
      for (let j = 0; j < this.warenService.currentProductsInBuchungSig()[i].product_variation.length; j++ ) {
        quanity += this.warenService.currentProductsInBuchungSig()[i].product_variation[j].quanity;
        price += Number(this.warenService.currentProductsInBuchungSig()[i].product_variation[j].price) * Number(this.warenService.currentProductsInBuchungSig()[i].product_variation[j].quanity);
        tax += Number((this.warenService.currentProductsInBuchungSig()[i].product_variation[j].price * this.warenService.currentProductsInBuchungSig()[i].product_variation[j].mwst / 100) * this.warenService.currentProductsInBuchungSig()[i].product_variation[j].quanity);
      }
    }

    return { quanity, price, tax };
  }
  getValueinEuro(value: number) {
    if(this.warenEingangForm.get('wahrung_rate'))
    return value * Number(this.warenEingangForm.get('wahrung_rate')?.getRawValue());

    return 0;
  }
  shippingcostChange() {

      this.warenEingangForm.get('shipping_cost_eur')?.patchValue(this.getValueinEuro(this.warenEingangForm.get('shipping_cost')?.getRawValue()));
      this.warenEingangForm.get('other_cost_eur')?.patchValue(this.getValueinEuro(this.warenEingangForm.get('other_cost')?.getRawValue()));

  }
}
