import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { WareneingangService } from '../wareneingang.service';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { LiferantsService } from '../../liferants/liferants.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-buchung',
  templateUrl: './add-edit-buchung.component.html',
  styleUrls: ['./add-edit-buchung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class AddEditBuchungComponent implements OnInit{
  products: iWareneingangProduct[] = [];
  warenEingangForm: FormGroup;
  act$ = new Observable();
  liferants$ = this.lieferants.liferants$;
  constructor (private readonly dialRef: MatDialogRef<AddEditBuchungComponent>,
    private readonly warenService: WareneingangService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iWarenEingang,
    private readonly fb: FormBuilder,
    public err: ErrorService,
    private readonly lieferants: LiferantsService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    ) {
      this.warenEingangForm =  this.fb.group({
        id: [data?.id || null],
        lieferant: [data?.lieferant.id || null, Validators.required],
        empfangsdatum: [data?.empfangsdatum || null, Validators.required],
        rechnung: [data?.rechnung || null, Validators.required],
        lieferscheinNr: [data?.lieferscheinNr || null ],
        datenEingabe: [{ value:  data?.datenEingabe || null, disabled: true }],
        gebucht: [data?.gebucht || false],
        eingelagert: [{value: data?.eingelagert || false, disabled: true }],
      });
    }
  ngOnInit(): void {
    this.warenService.lieferantIdSig.set(0);
    this.warenService.currentWarenEingangSig.set(this);
    if(this.data && this.data.id)
      this.act$ = this.warenService.getWareneingangBuchungbeiId(this.data.id).pipe(tap((res) => {
          if(res.id) {
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
            if(res.lieferant.id)
            this.warenService.lieferantIdSig.set(res.lieferant.id)

           this.warenService.currentProductsInBuchungSig.set(res.products);
          }
      }))
  }

  saveGoodsReceipt() {
    if (this.warenEingangForm.valid) {
      const buchung: iWarenEingang = this.warenEingangForm.value;

      if(this.products.length > 1)
        buchung.products = this.products;
        const eD = this.datePipe.transform(this.warenEingangForm.get('empfangsdatum')?.getRawValue(), 'yyyy-MM-dd');
        if(eD)
        buchung.empfangsdatum =  eD;

        const buchungs_Datum = this.datePipe.transform(new Date(Date.now()).toISOString(), 'yyyy-MM-dd');;
        if(this.warenEingangForm.get('gebucht')?.getRawValue() == true && buchungs_Datum)
        buchung.datenEingabe = buchungs_Datum;

        if(!this.data) {
        this.act$ = this.warenService.createWareneingangBuchung(buchung).pipe(
          tap((res) => {
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
            this.data = res;
            this.snackBar.open('Die buchung wurde gespeichert');
          })
        )
      } else {
        this.act$ = this.warenService.updateWareneingangBuchung(buchung).pipe(
          tap((res) => {
            this.warenEingangForm.patchValue(res);
            this.warenEingangForm.get('lieferant')?.patchValue(res.lieferant.id);
            this.data = res;
            this.snackBar.open('Die buchung wurde gespeichert');
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
}
