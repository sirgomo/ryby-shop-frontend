import { ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { OrderSelectorComponent } from './order-selector/order-selector.component';
import { OrdersService } from 'src/app/orders/orders.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';
import { ErrorService } from 'src/app/error/error.service';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { iCompany } from 'src/app/model/iCompany';
import { iRefunds } from 'src/app/model/iRefund';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';



describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let testController: HttpTestingController;
  let orders: iBestellung[] = [];
  let order: iBestellung;
  let order2: iBestellung;
  let changeDetector: ChangeDetectorRef;
  let company: iCompany;
  let refunds: iRefunds;

  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => 'ADMIN');
    getTestData();
    TestBed.configureTestingModule({
      imports: [OrderComponent, OrderSelectorComponent, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, PaginatorComponent,
         HttpClientTestingModule, BrowserAnimationsModule],
      providers: [OrdersService, ErrorService],
    });
    fixture = TestBed.createComponent(OrderComponent);
    testController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    changeDetector = fixture.debugElement.injector.get(ChangeDetectorRef);

  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
 it('should create', () => {

    fixture.detectChanges();
    const requ = testController.expectOne(environment.api+'order/all/get/1');
    expect(requ.request.method).toBe('POST');
    requ.flush([]);
    expect(component).toBeTruthy();
  });
  it('it should get orders from api', async () => {

    fixture.detectChanges();

    const requ = testController.expectOne(environment.api+'order/all/get/1');
    expect(requ.request.method).toBe('POST');
    requ.flush([orders, 1]);
    await fixture.whenStable();
    changeDetector.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

    expect(component.ordersSig()).toEqual(orders);
    expect(items.length).toBe(2);
  })
  it( 'it should click open details', async () => {

    fixture.detectChanges();

    const requ = testController.expectOne(environment.api+'order/all/get/1');
    expect(requ.request.method).toBe('POST');
    requ.flush([orders, 1]);
    await fixture.whenStable();
    changeDetector.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
    const butt = fixture.nativeElement.querySelectorAll('button')[0];
    jest.spyOn(component, 'openDetailts');
    butt.click();

    const requ2 = testController.expectOne(environment.api+'order/1');
    expect(requ2.request.method).toBe('GET');
    requ2.flush(order);
    await fixture.whenStable();


    expect(component.openDetailts).toHaveBeenCalledTimes(1);
  });
  it( 'it should click open invoice', async () => {

    fixture.detectChanges();

    const requ = testController.expectOne(environment.api+'order/all/get/1');
    expect(requ.request.method).toBe('POST');
    requ.flush([orders, 1]);
    await fixture.whenStable();
    changeDetector.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
    const butt = fixture.nativeElement.querySelectorAll('button')[1];
    jest.spyOn(component, 'openInovice');
    butt.click();

    expect(component.openInovice).toHaveBeenCalledTimes(1);
  })
  it( 'it should click refund', async () => {

    fixture.detectChanges();

    const requ = testController.expectOne(environment.api+'order/all/get/1');
    expect(requ.request.method).toBe('POST');
    requ.flush([orders, 1]);
    await fixture.whenStable();

    changeDetector.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
    const butt = fixture.nativeElement.querySelectorAll('button')[2];
    jest.spyOn(component, 'refund');
    butt.click();

    const requ2 = testController.expectOne(environment.api+'order/1');
    expect(requ2.request.method).toBe('GET');
    requ2.flush(order);
    await fixture.whenStable();

    expect(component.refund).toHaveBeenCalledTimes(1);
  })

  function getTestData() {
    orders = [];
    order  = {
      id:1,
      kunde: {} as iUserData,
      produkte: [],
      bestelldatum: new Date('2020/02/01'),
      status: '',
      versand_datum: new Date('2020/02/01'),
      zahlungsart: '',
      gesamtwert: 0,
      zahlungsstatus: '',
      bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
      versandart: '',
      versandprice: 0,
      varsandnr: '123',
      paypal_order_id: '',
      refunds: []
    };
    order2  = {
      id: 2,
      kunde: {} as iUserData,
      produkte: [],
      bestelldatum: new Date('2021/02/01'),
      status: '',
      versand_datum: new Date('2021/02/01'),
      zahlungsart: '',
      gesamtwert: 0,
      zahlungsstatus: '',
      bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
      versandart: '',
      versandprice: 0,
      varsandnr: '',
      paypal_order_id: '',
      refunds: []
    };
    orders.push(order);
    orders.push(order2);

    company  = {
      name: 'asjdkahsd',
      company_name: '',
      address: '',
      city: '',
      postleitzahl: '',
      country: '',
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
    refunds  = {
      orderId: '1',
      creationDate: new Date('2020-01-01'),
      reason: '',
      comment: '',
      amount: 1,
      transaction: {} as iEbayTransaction,
      refund_items: []
    };
  }
});
