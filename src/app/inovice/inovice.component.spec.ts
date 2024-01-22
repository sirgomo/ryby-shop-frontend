import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InoviceComponent } from './inovice.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BESTELLUNGSSTATUS, iBestellung } from '../model/iBestellung';
import { iUserData } from '../model/iUserData';
import { iProduktRueckgabe } from '../model/iProduktRueckgabe';
import { environment } from 'src/environments/environment';
import { iCompany } from '../model/iCompany';
import { iProductBestellung } from '../model/iProductBestellung';
import { iProduct } from '../model/iProduct';
import { iLieferant } from '../model/iLieferant';
import { ErrorService } from '../error/error.service';
import { CompanyService } from '../admin/company/company.service';
import { RefundService } from '../ebay/refund/refund.service';
import { OrdersService } from '../orders/orders.service';
import { IShippingCost } from '../model/iShippingCost';


describe('InoviceComponent', () => {
  let component: InoviceComponent;
  let fixture: ComponentFixture<InoviceComponent>;
  let testController: HttpTestingController;
  let error: ErrorService;
  let compSer: CompanyService;
  let ordServ: OrdersService;
  let refServ: RefundService;


  const company: iCompany = {
    id: 1,
    name: 'jkasdhahsd',
    company_name: 'jdghahsdgl',
    address: 'jkasdjkashjkd',
    city: 'jkasdhaskjhdkash',
    postleitzahl: 'ajksdaksdhasjkd',
    country: 'jkasdkajhdh',
    phone: '',
    email: '',
    isKleinUnternehmen: 0,
    ustNr: '',
    fax: '',
    eu_komm_hinweis: '',
    agb: '',
    daten_schutzt: '',
    cookie_info: '',
    is_in_urlop: false
  };
  const user: iUserData = {
    id: 1,
    vorname: 'jskhashd',
    nachname: ' jkasdh kjh',
    email: 'asjhd ajksh jkas',
    telefon: '3243005466546',
    adresse: {
      strasse: ' uioazsd jkash skjasd',
      hausnummer: 'asjkdh jkas kjhsadkj',
      stadt: '',
      postleitzahl: '',
      land: ''
    }
  };
  const ref:iProduktRueckgabe = {
    id:1,
    bestellung: {} as iBestellung,
    produkte: [],
    kunde: user,
    rueckgabegrund: 'jhasgdh jhasgd ',
    rueckgabestatus: 'OK',
    amount: 1.5,
    paypal_refund_id: '',
    paypal_refund_status: '',
    corrective_refund_nr: 0,
    is_corrective: 0
  };
  const shippCost: IShippingCost = {
    shipping_name: 'DHL',
    shipping_price: 1.5,
    average_material_price: 0,
    cost_per_added_stuck: 0
  };
  const iprod: iProduct = {
    id: 1,
    name: '',
    sku: '',
    artid: 0,
    beschreibung: '',
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
    shipping_costs: [shippCost],
  };
  const prod:iProductBestellung = {
    id:1,
    bestellung: 1,
    produkt: [iprod],
    menge: 5,
    color: '',
    color_gepackt: '',
    rabatt: 0,
    mengeGepackt: 0,
    verkauf_price: 3.44,
    verkauf_rabat: 0,
    verkauf_steuer: 0,
    productRucgabe: ref,
  };
  const invoice: iBestellung = {
    id: 1,
    kunde: user,
    produkte: [prod],
    bestelldatum: new Date('2022-01-01'),
    status: '',
    versand_datum: new Date('2022-01-01'),
    zahlungsart: '',
    gesamtwert: 4.5,
    zahlungsstatus: '',
    bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
    versandart: '',
    versandprice: 1.5,
    varsandnr: '',
    paypal_order_id: '',
    refunds: [ref],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InoviceComponent, MatIconModule, CommonModule, MatTableModule, MatFormFieldModule, MatProgressSpinnerModule,
         MatButtonModule, NoopAnimationsModule, HttpClientTestingModule, ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: invoice,
        },
        DatePipe,
        ErrorService,
        CompanyService,
        OrdersService,
        RefundService,
      ],
    });
    fixture = TestBed.createComponent(InoviceComponent);
    component = fixture.componentInstance;
    error = TestBed.inject(ErrorService);
    compSer = TestBed.inject(CompanyService);
    ordServ = TestBed.inject(OrdersService);
    refServ = TestBed.inject(RefundService);
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    getInitRequests(testController, company, invoice, ref);

    expect(component).toBeTruthy();
  });
  it('should display error message if errorService has a message', () => {


    getInitRequests(testController, company, invoice, ref);
    const errorMessage = 'Test error message';
    error.newMessage('Test error message');
    fixture.detectChanges();
    const errorElement: HTMLElement = fixture.nativeElement.querySelector('#error');
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('should call savePdf when save button is clicked', () => {
    getInitRequests(testController, company, invoice, ref);
    jest.spyOn(component, 'savePdf');
    const button = fixture.nativeElement.querySelector('.close button:first-child');
    button.click();
    expect(component.savePdf).toHaveBeenCalled();
  });

  it('should call close when close button is clicked', () => {
    getInitRequests(testController, company, invoice, ref);
    jest.spyOn(component, 'close');
    const button = fixture.nativeElement.querySelector('.close button:last-child');
    button.click();
    expect(component.close).toHaveBeenCalled();
  });

  it('should display company information', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const companyElement: HTMLElement = fixture.nativeElement.querySelector('.company');
    expect(companyElement.textContent).toContain(component.company.name);
    expect(companyElement.textContent).toContain(component.company.address);
  });

  it('should display customer information', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const customerElement: HTMLElement = fixture.nativeElement.querySelector('.customer');
    expect(customerElement.textContent).toContain(component.currentItem.kunde.vorname);
    expect(customerElement.textContent).toContain(component.currentItem.kunde.nachname);
  });

  it('should display invoice data', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const rechNumm: HTMLElement = fixture.nativeElement.querySelector('#rechnumm');
    const rechDate: HTMLElement = fixture.nativeElement.querySelector('#rechdate');
    const datePipe = new DatePipe('en-US');
    if(component.currentItem.id)
    expect(rechNumm.textContent).toContain('Rechnungsnummer: '+invoice.id);
    expect(rechDate.textContent).toContain('Rechnungsdatum: '+ datePipe.transform(invoice.bestelldatum, 'dd/MM/yyyy'));
  });

  it('should display table with product information', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    //default are 3 tr
    expect(tableRows.length).toBe(component.currentItem.produkte.length +3);
  });

  it('should display correct total values', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();

    const totalBruttoElement: HTMLElement = fixture.nativeElement.querySelector('#totalBrutto');
    expect(totalBruttoElement.textContent).toContain(component.getTotalBrutto().toFixed(2));
  });

  it('should display shipping costs', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const shippingElement: HTMLElement = fixture.nativeElement.querySelector('.versand .preise');
    expect(shippingElement.textContent).toContain(component.currentItem.versandprice.toFixed(2));
  });

  it('should display total price with shipping', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const totalPriceElement: HTMLElement = fixture.nativeElement.querySelector('#totalPricewithShipping');
    expect(totalPriceElement.textContent).toContain(component.getPriceWithShipping().toFixed(2));
  });

  it('should display Kleinunternehmer message if company is Kleinunternehmer', async () => {
    const ordRequ = testController.expectOne(environment.api + 'order/' + invoice.id);
    expect(ordRequ.request.method).toBe('GET');
    ordRequ.flush(invoice);


    const compRequ = testController.expectOne(environment.api + 'company');
    expect(compRequ.request.method).toBe('GET');
    compRequ.flush([{ ...company, isKleinUnternehmen: 1}]);


    const refRequ = testController.expectOne(environment.api + 'refund/1');
    expect(refRequ.request.method).toBe('GET');
    refRequ.flush([ref]);

    let kunternehmenElement;
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      kunternehmenElement = fixture.nativeElement.querySelector('#kleinunternehmen');
      expect(kunternehmenElement).toBeTruthy();
    })


  });

  it('should not display Kleinunternehmer message if company is not Kleinunternehmer', () => {
    getInitRequests(testController, company, invoice, ref);
    fixture.detectChanges();
    const kunternehmenElement: HTMLElement = fixture.nativeElement.querySelector('.kunternehmen');
    expect(kunternehmenElement).toBeFalsy();
  });
});
function getInitRequests(testController: HttpTestingController, company: iCompany, invoice: iBestellung, ref: iProduktRueckgabe) {
  const compRequ = testController.expectOne(environment.api + 'company');
  expect(compRequ.request.method).toBe('GET');
  compRequ.flush([company]);

  const ordRequ = testController.expectOne(environment.api + 'order/' + invoice.id);
  expect(ordRequ.request.method).toBe('GET');
  ordRequ.flush(invoice);

  const refRequ = testController.expectOne(environment.api + 'refund/1');
  expect(refRequ.request.method).toBe('GET');
  refRequ.flush([ref]);
}

