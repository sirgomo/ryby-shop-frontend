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
  let detectChanges: ChangeDetectorRef;

  beforeEach(() => {
    window.open = jest.fn();
    TestBed.configureTestingModule({
      imports: [EbayComponent, CommonModule, FormsModule, MatTableModule, InoviceComponent, MatDialogModule, MatButtonModule,
         MatIconModule, EbayTransactionsComponent, ErrorComponent, RefundComponent, HttpClientTestingModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(EbayComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    detectChanges = fixture.debugElement.injector.get(ChangeDetectorRef);

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
 /* it('should show orders and open invoice on click', fakeAsync( () => {
    const order  = {
      orderId: 'duap',
      buyer: {
        username: 'katos'
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
        },
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
    requ.flush(ebayOrder, { status: 200, statusText: 'OK'});

    tick();


    const requ2 = testController.expectOne(environment.api + 'refund/duap');
    expect(requ2.request.method).toBe('GET');

    requ2.flush( [{id: -1}], { status: 200, statusText: 'OK'});
    tick();

    const requ3 = testController.expectOne(environment.api + 'refund/duapa');
    expect(requ3.request.method).toBe('GET');
    requ3.flush(  [{id: -1}], { status: 200, statusText: 'OK'});
    tick();

    //fixture.detectChanges();
    detectChanges.detectChanges();
    flushMicrotasks();
    flush();



    const contDev = fixture.debugElement.queryAll(By.css('.content'));
    expect(contDev).toStrictEqual([]);
    const itemList = fixture.debugElement.queryAll(By.css('tr'));
    expect(itemList.length).toBe(3);


  }))*/

});
