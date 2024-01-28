import { ComponentFixture, TestBed, fakeAsync, flush, flushMicrotasks, tick, waitForAsync } from '@angular/core/testing';

import { EbayComponent } from './ebay.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ErrorComponent } from '../error/error.component';
import { InoviceComponent } from '../inovice/inovice.component';
import { EbayTransactionsComponent } from './ebay-transactions/ebay-transactions.component';
import { RefundComponent } from './refund/refund.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { iEbayAllOrders } from '../model/ebay/orders/iEbayAllOrders';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';
import { ChangeDetectorRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { TransitionCheckState } from '@angular/material/checkbox';

describe('EbayComponent', () => {
  let component: EbayComponent;
  let fixture: ComponentFixture<EbayComponent>;
  let testController: HttpTestingController;


  beforeEach(() => {
    window.open = jest.fn();
    TestBed.configureTestingModule({
      imports: [EbayComponent, CommonModule, FormsModule, MatTableModule, InoviceComponent, MatDialogModule, MatButtonModule,
         MatIconModule, EbayTransactionsComponent, ErrorComponent, RefundComponent, HttpClientTestingModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(EbayComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);


  });
  afterEach(() => {
    testController.verify();
    jest.resetAllMocks();
  })
  it('should create', () => {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);

    expect(component).toBeTruthy();

  });
  it('not logged, show login div to ebay and get consent link', ()=> {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);
    const contDiv = fixture.debugElement.query(By.css('.content'));
    expect(contDiv).toBeDefined();
  });
  it('should click getLink for ebay Login', ()=> {
    fixture.detectChanges();
    const wind = jest.spyOn(window, 'open').mockImplementationOnce(() => {
      component.show_input = true;
      return null;
    });

    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);

    const contDiv = fixture.debugElement.query(By.css('.content'));
    expect(contDiv).toBeDefined();
     const getLink = jest.spyOn(component, 'getLink');
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    expect(getLink).toHaveBeenCalledTimes(1);
    const req = testController.expectOne(environment.api + 'ebay'+'/consent');
    expect(req.request.method).toBe('GET');
    req.flush('address');


    expect(wind).toHaveBeenCalled();
    expect(component.show_input).toBeTruthy();
  });
  it('should show orders and open invoice on click',  () => {

    jest.spyOn(component.dialog, 'open').mockReturnThis();
    jest.spyOn(component, 'openInovice');
    const order  = {
      orderId: 'duap',
      buyer: {
        username: 'katos',
        buyerRegistrationAddress : {
          contactAddress:   {
              addressLine1: 'asjkdhash',
              postalCode: '213123',
              city: 'dsada',
              countryCode: 'DE',
              addressLine2: 'asdasd',

            },
            fullName: 'jkahdkha  kjashdkhashkd'
        },
      },
      paymentSummary: {
        payments: [ {
          paymentStatus: 'payd',
          paymentDate: new Date('2020-02-22'),
        }]},
        orderFulfillmentStatus: 'bleh',
        pricingSummary: {
          total: {
            value: 4,
          },
          deliveryCost: {
            value: 1,
          },
        },
        lineItems: [
          {
            title: 'hjasdghasgd',
            sku: 'aahsdghjasg',
            quantity: 3,
            lineItemCost: {
              value: 1,
            },
            variationAspects: [{
              name: 'asd',
              value: 'sadsd',
            }],
            taxes: [],
          },
        ],
    } as unknown as iEbayOrder;
    const order2  = {
      orderId: 'duapa',
      buyer: {
        username: 'katoss'
      },
      paymentSummary: {
        payments: [ {
          paymentStatus: 'payd',
          paymentDate: new Date('2020-02-21'),
        }]},
        orderFulfillmentStatus: 'bleh',
        pricingSummary: {
          total: {
            value: 2.54,
          },
        },
    } as unknown as iEbayOrder;;
    const ebayOrder: iEbayAllOrders = {
      href: 'string',
      limit: 'integer',
      next: 'string',
      offset: 'integer',
      orders: [order, order2],
      prev: 'string',
      total: 'integer',
      warnings: [{} as any],
    };
    fixture.detectChanges();
     const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush(ebayOrder);


    fixture.detectChanges();

    const requ2 = testController.expectOne(environment.api + 'refund/duap');
    expect(requ2.request.method).toBe('GET');
    requ2.flush( [{id: -1}]);
    fixture.detectChanges();

    const requ3 = testController.expectOne(environment.api + 'refund/duapa');
    expect(requ3.request.method).toBe('GET');
    requ3.flush(  [{id: -1}]);
    fixture.detectChanges();
    //??? this 2 should not to be ... its like componenet loaded in dialog InoviceComponent byl zaladowany zanim jeszcze uzytkownik kliknol
    const requ4 = testController.expectOne(environment.api + 'ebay-sold/duap');
    expect(requ4.request.method).toBe('GET');
    requ4.flush( [{id: -1}]);
    const requ5 = testController.expectOne(environment.api + 'ebay-sold/duapa');
    expect(requ5.request.method).toBe('GET');
    requ5.flush( [{id: -1}]);
    fixture.detectChanges();

    const contDev = fixture.debugElement.queryAll(By.css('.content'));
    expect(contDev).toStrictEqual([]);
    const itemList = fixture.debugElement.queryAll(By.css('tr'));
    expect(itemList.length).toBe(3);
    const butt = fixture.nativeElement.querySelector('#openInovice');
    butt.click();
    fixture.detectChanges();
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
    expect(component.openInovice).toHaveBeenLastCalledWith(order);


  });

});
