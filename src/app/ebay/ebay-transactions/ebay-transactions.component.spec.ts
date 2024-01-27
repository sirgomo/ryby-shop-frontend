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
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('EbayTransactionsComponent', () => {
  let component: EbayTransactionsComponent;
  let fixture: ComponentFixture<EbayTransactionsComponent>;
  let ebayTransactionsService: EbayTransactionsService;
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
    items: [],
    refunds: [],
    sel_amount: 2,
    id: 1,
    creationDate: new Date('2022-05-03')
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayTransactionsComponent, CommonModule, MatButtonModule, MatIconModule, NoopAnimationsModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayTransactionsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });



  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getTransactionById on init and assign to isItem$", () => {
    component.item = mockEbayOrder;
    fixture.detectChanges();
    expect(ebayTransactionsService.getTransactionById).toHaveBeenCalledWith(mockEbayOrder.orderId);
    component.isItem$.subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });
  });

  it("should display Buchen button when transaction is not booked", () => {
    component.isItem$ = of({ ...mockTransaction, id: -1 });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain("Buchen");
  });

  it("should display Buched when transaction is booked", () => {
    component.isItem$ = of(mockTransaction);
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css("span"));
    expect(span).toBeTruthy();
    expect(span.nativeElement.textContent).toContain("Buched");
  });

  it("should call errorService when transaction_booking is called and order is not paid", () => {
    component.item = { ...mockEbayOrder, orderPaymentStatus: "NOT_PAID" };
    fixture.detectChanges();
    component.transaction_booking();
    expect(errorService.message.set).toHaveBeenCalledWith("Transaction not paid !");
  });

  it("should call createTransaction when transaction_booking is called and order is paid", () => {
    component.item = mockEbayOrder;
    fixture.detectChanges();
    component.transaction_booking();
    expect(ebayTransactionsService.createTransaction).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should update isItem$ when createTransaction is successful", () => {
    component.item = mockEbayOrder;
    fixture.detectChanges();
    component.transaction_booking();
    component.isItem$.subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });
  });

  it("should handle error when createTransaction fails", () => {
    jest.spyOn(ebayTransactionsService, "createTransaction").mockReturnValue(throwError(() => new Error("Error")));
    component.item = mockEbayOrder;
    fixture.detectChanges();
    component.transaction_booking();
    expect(errorService.message.set).toHaveBeenCalledWith("Error");
  });
});

