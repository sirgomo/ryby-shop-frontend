import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRefundsComponent } from './order-refunds.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ErrorComponent } from 'src/app/error/error.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderRefundsService } from './order-refunds.service';
import { OrdersService } from 'src/app/orders/orders.service';
import { RUECKGABESTATUS, iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { environment } from 'src/environments/environment';


describe('OrderRefundsComponent', () => {
  let component: OrderRefundsComponent;
  let fixture: ComponentFixture<OrderRefundsComponent>;
  let testController: HttpTestingController;
  const refund:iProduktRueckgabe = {
    id: 1,
    bestellung: { id: 1} as iBestellung,
    produkte: [],
    kunde: { } as iUserData,
    rueckgabegrund: 'piwo',
    rueckgabestatus: RUECKGABESTATUS.FULL_REFUND,
    amount: 2.44,
    paypal_refund_id: '',
    paypal_refund_status: '',
    corrective_refund_nr: 0,
    is_corrective: 0
  };
  const bestData:iBestellung = {
    id: 1,
    kunde: {} as iUserData,
    produkte: [],
    bestelldatum: new Date('2021-20-01'),
    status: '',
    versand_datum: new Date('2021-20-01'),
    zahlungsart: '',
    gesamtwert: 0,
    zahlungsstatus: '',
    bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
    versandart: 'DHL',
    versandprice: 2.5,
    varsandnr: '',
    paypal_order_id: '',
    refunds: [refund],
    shipping_address_json: '',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRefundsComponent, CommonModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatInputModule, ErrorComponent, MatCardModule, MatSelectModule, MatCheckboxModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: bestData,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        OrderRefundsService,
        OrdersService
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderRefundsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const inital = testController.expectOne(environment.api+'order/'+bestData.id);
    expect(inital.request.method).toBe('GET');
    inital.flush(bestData);
  });
  afterEach(() => {
    testController.verify()
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display refund information correctly', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-card-title').textContent).toContain(`Refund für ${bestData.id}`);
    expect(fixture.nativeElement.querySelector('input[formControlName="rueckgabegrund"]').value).toBe(refund.rueckgabegrund);
    expect(fixture.nativeElement.querySelector('input[formControlName="paypal_refund_id"]').value).toBe(refund.paypal_refund_id);
    expect(fixture.nativeElement.querySelector('input[formControlName="amount"]').value).toBe(refund.amount.toString());
    expect(fixture.nativeElement.querySelector('mat-select[formControlName="rueckgabestatus"]').textContent).toContain(refund.rueckgabestatus);
  });

  it('should add new product to refund', () => {
    const initialProductsCount = component.produkte.length;
    component.addProdukt({ id: 2, color: 'red', menge: 2, verkauf_price: 100 } as any);
    fixture.detectChanges();
    expect(component.produkte.length).toBe(initialProductsCount + 1);
  });

  it('should remove product from refund', () => {
    component.addProdukt({ id: 2, color: 'red', menge: 2, verkauf_price: 100 } as any);
    fixture.detectChanges();
    const initialProductsCount = component.produkte.length;
    component.removeProdukt(0);
    fixture.detectChanges();
    expect(component.produkte.length).toBe(initialProductsCount - 1);
  });

  it('should call saveRefund method when save button is clicked', () => {
    jest.spyOn(component, 'saveRefund');
    const button = fixture.debugElement.nativeElement.querySelector('button[color="primary"]');
    button.click();
    expect(component.saveRefund).toHaveBeenCalled();
  });

  it('should display error message if refund form is invalid and save button is clicked', () => {
    component.refund.controls['rueckgabegrund'].setValue('hasdhaskdshk');
    fixture.detectChanges();
    expect(component.refund.valid).toBeTruthy();
    expect(component.currentRefund.is_corrective).toBeFalsy();
    jest.spyOn(component.snack, 'open');
    const button = fixture.debugElement.nativeElement.querySelector('#saveEnabled');
    button.click();
    expect(component.snack.open).toHaveBeenCalledWith('Das Bestätigungskästchen, dass Sie die Rücksendung korrigieren möchten, muss aktiv sein, um dies zu tun.', 'Ok', { duration: 3000 });
  });

  it('should enable save button when form is valid', () => {
    component.refund.controls['rueckgabegrund'].setValue('Test Grund');
    component.refund.controls['rueckgabestatus'].setValue('COMPLETE');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button[color="primary"]:not([disabled])');
    expect(button).toBeTruthy();
  });

  it('should disable save button when form is invalid', () => {
    component.refund.controls['rueckgabegrund'].setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button[color="primary"][disabled]');
    expect(button).toBeTruthy();
  });

  it('should show corrective id input when is_corrective is checked', () => {
    component.refund.controls['is_corrective'].patchValue(true);
    const check = fixture.nativeElement.querySelector('#is_corrective');
    check.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const correctiveIdInput = fixture.debugElement.nativeElement.querySelector('#corrective_refund_nr');
    expect(component.refund.controls['is_corrective'].getRawValue()).toBe(true);
    expect(correctiveIdInput).toBeTruthy();
  });

  it('should hide corrective id input when is_corrective is unchecked', () => {
    component.refund.controls['is_corrective'].setValue(false);
    fixture.detectChanges();
    const correctiveIdInput = fixture.debugElement.nativeElement.querySelector('input[formControlName="corrective_refund_nr"]');
    expect(correctiveIdInput).toBeNull();
  });
});
