import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsComponent } from './order-details.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from 'src/app/error/error.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorService } from 'src/app/error/error.service';
import { OrdersService } from 'src/app/orders/orders.service';
import { BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';
import { iProductBestellung } from 'src/app/model/iProductBestellung';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { environment } from 'src/environments/environment';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let testController: HttpTestingController;
  let best: iBestellung;
  beforeEach(() => {
    const prodin: iProduct = {
      id: 1,
      name: 'jksaahsd',
      sku: 'asjkdahds',
      artid: 0,
      beschreibung: 'ajksdk hajkshd jasd 1',
      lieferant: {} as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '',
      kategorie: [],
      verfgbarkeit: 0,
      product_sup_id: '',
      ebay: 0,
      wareneingang: [],
      mehrwehrsteuer: 0,
      promocje: [],
      bewertung: [],
      eans: [],
      variations: [],
      produkt_image: '',
      shipping_costs: []
    };
    const prod: iProductBestellung = {
      bestellung: 1,
      produkt: [prodin],
      menge: 5,
      color: '',
      color_gepackt: '',
      rabatt: 0,
      mengeGepackt: 0,
      verkauf_price: 2.4,
      verkauf_rabat: 0,
      verkauf_steuer: 0,
      productRucgabe: {} as iProduktRueckgabe,
    };
    best = {
      id: 12345,
      kunde: {} as iUserData,
      produkte: [prod],
      bestelldatum: new Date('2022-01-02'),
      status: '',
      versand_datum: new Date('2022-01-05'),
      zahlungsart: '',
      gesamtwert: 15,
      zahlungsstatus: '',
      bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
      versandart: 'DHL',
      versandprice: 1.5,
      varsandnr: 'hjasgdhagsdj',
      paypal_order_id: '',
      refunds: []
    };

    TestBed.configureTestingModule({
      imports: [OrderDetailsComponent, ErrorComponent, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule,
        CommonModule, MatProgressSpinnerModule, MatMomentDateModule, MatButtonModule, MatDialogModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        OrdersService,
        ErrorService,
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: best,
        },
      ],
    });
    fixture = TestBed.createComponent(OrderDetailsComponent);
    testController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush({});
    expect(component).toBeTruthy();
  });
  it('should display the correct order number', () => {
    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.title h2').textContent).toContain('Bestellung nr: 12345');
  });

  it('should call close method when close button is clicked', () => {
    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    fixture.detectChanges();
    jest.spyOn(component, 'close');
    const button = fixture.debugElement.nativeElement.querySelector('.title button');
    button.click();
    expect(component.close).toHaveBeenCalled();
  });
  it('should update versand_datum when date is picked', () => {
    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    fixture.detectChanges();

    fixture.detectChanges();
    const input = fixture.debugElement.nativeElement.querySelector('#versand_datum');

    expect(input.value).toBe('1/5/2022');
  });
  it('should display the correct number of products', () => {

    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.tab-row').length).toBe(1);
  });
  it('should update varsandnr when input value changes', () => {

    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    const versandNr = fixture.nativeElement.querySelector('#versand_nummer');

    versandNr.value = '123123';
    versandNr.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.data.varsandnr).toBe('123123');
  });

  it('should correctly update the mengeGepackt when input changes', () => {
    fixture.detectChanges();
    const newMengeGepackt = 2;
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(best);
    fixture.detectChanges();
    const input = fixture.debugElement.nativeElement.querySelector('#mengeGepackt');
    input.value = newMengeGepackt;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.currentItem()?.produkte[0].mengeGepackt).toBe(newMengeGepackt);
  });

  it('should display snackBar message when saveOrder is successful', () => {
    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush({});
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('#saveOrder');
    butt.click();
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'order/update');
    expect(requ2.request.method).toBe('PATCH');
    requ2.flush({ id: 1});

    expect(component.snackBar.open).toHaveBeenCalledWith('Bestellung gespiechert', '', { duration: 1500 });
  });

  it('should display snackBar message when saveOrder fails', () => {
    fixture.detectChanges();
    jest.spyOn(component.snackBar, 'open');
    const requ = testController.expectOne(environment.api+'order/'+best.id);
    expect(requ.request.method).toBe('GET');
    requ.flush({});
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('#saveOrder');
    butt.click();
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'order/update');
    expect(requ2.request.method).toBe('PATCH');
    requ2.flush({});

    expect(component.snackBar.open).toHaveBeenCalledWith('Etwas ist schieffgelaufen, Bestellung wurde nicht gespeichert', 'Ok', { duration: 2000 });
  });
});
