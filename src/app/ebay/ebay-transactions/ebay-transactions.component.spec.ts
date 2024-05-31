import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayTransactionsComponent } from './ebay-transactions.component';
import { ErrorService } from 'src/app/error/error.service';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';
import { EbayTransactionsService } from './ebay-transactions.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { By } from '@angular/platform-browser';


describe('EbayTransactionsComponent', () => {
  let component: EbayTransactionsComponent;
  let fixture: ComponentFixture<EbayTransactionsComponent>;

  let errorService: ErrorService;
  let testController: HttpTestingController;

  const mockEbayOrder: any = {
    orderId: "123",
    orderPaymentStatus: "PAID",
    pricingSummary: {
      total: { value: "100" },
      deliveryCost: { value: "10" },
      deliveryDiscount: { value: "5" },
      tax: { value: "15" },
      priceDiscount: { value: "20" }
    },
    paymentSummary: {
      payments: [
        {
          paymentStatus: "PAID",
          paymentMethod: "Credit Card"
        }
      ]
    },
    lineItems: [
      {
        sku: "item-1",
        title: "Item 1",
        quantity: "2",
        lineItemCost: { value: "30" }
      }
    ]
  };

  const mockTransaction: iEbayTransaction = {
    orderId: "123",
    payment_status: "PAID",
    price_total: 100,
    price_shipping: 10,
    price_tax: 15,
    price_discont: 20,
    ebay_advertising_cost: 0,
    ebay_fee: 0,
    items: [],
    refunds: [],
    sel_amount: 2,
    id: 1,
    creationDate: new Date('2022-05-03'),
    zahlungsart: '',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayTransactionsComponent, CommonModule, MatButtonModule, MatIconModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [EbayTransactionsService, ErrorService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayTransactionsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    component.item = mockEbayOrder;
    fixture.detectChanges();
  });

  afterEach(() => {
    testController.verify();
  })

  it("should create", () => {
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush(mockTransaction);
    expect(component).toBeTruthy();
  });

  it("should display one item in transaction list", () => {
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush(mockTransaction);
    fixture.detectChanges();
    const divItem = fixture.debugElement.queryAll(By.css("div"));
    expect(divItem.length).toBe(1);

  });

  it("should display Buchen button when transaction is not booked", () => {
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush({ id: -1 });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain("Buchen");
  });

  it("should display Buched when transaction is booked", () => {
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush(mockTransaction);
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css("span"));
    expect(span).toBeTruthy();
    expect(span.nativeElement.textContent).toContain("Buched");
  });

  it("should call errorService when transaction_booking is called and order is not paid", () => {
    //[FAILED,PAID,PENDING]"
    component.item = {
      orderId: "123",
      orderPaymentStatus: "PENDING",
      pricingSummary: {
        total: { value: "100" },
        deliveryCost: { value: "10" },
        deliveryDiscount: { value: "5" },
        tax: { value: "15" },
        priceDiscount: { value: "20" }
      },
      paymentSummary: {
        payments: [
          {
            paymentStatus: "PENDING",
            paymentMethod: "Credit Card"
          }
        ]
      },
      lineItems: [
        {
          sku: "item-1",
          title: "Item 1",
          quantity: "2",
          lineItemCost: { value: "30" }
        }
      ]
    } as any;


    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush({ id: -1 });
    fixture.detectChanges();
    component.transaction_booking();
    fixture.detectChanges();
    expect(component.errorService.message()).toBe("Transaction not paid !");
  });

  it("should call createTransaction when transaction_booking is called and order is paid", () => {
    jest.spyOn(component, 'transaction_booking');
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush({ id: -1 });
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();

    const requ2 = testController.expectOne(environment.api+'ebay-sold');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(mockTransaction);
  });

  it("should update isItem$ when createTransaction is successful", () => {
    jest.spyOn(component, 'transaction_booking');
    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush({ id: -1 });
    expect(fixture.nativeElement.querySelectorAll('div').length).toBe(0);
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();

    const requ2 = testController.expectOne(environment.api+'ebay-sold');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(mockTransaction);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('div').length).toBe(1);
  });

  it("should handle error when createTransaction fails", () => {

    const requ = testController.expectOne(environment.api+'ebay-sold/'+mockEbayOrder.orderId);
    expect(requ.request.method).toBe('GET');
    requ.flush({ id: -1 });
    expect(fixture.nativeElement.querySelectorAll('div').length).toBe(0);
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();

    const requ2 = testController.expectOne(environment.api+'ebay-sold');
    expect(requ2.request.method).toBe('POST');
    requ2.flush({ message: 'server error' });
    fixture.detectChanges();
    expect(component.errorService.message()).toBe('server error');
  });
});

