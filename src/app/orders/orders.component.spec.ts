import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from '../paginator/paginator.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { environment } from 'src/environments/environment';
import { BESTELLUNGSSTATUS, iBestellung } from '../model/iBestellung';
import { iUserData } from '../model/iUserData';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let testController: HttpTestingController;
  let orders: iBestellung[];

  beforeEach(() => {
    setTestData();
    TestBed.configureTestingModule({
      imports: [OrdersComponent, OrdersComponent, MatTableModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, PaginatorComponent,
      HttpClientTestingModule, BrowserAnimationsModule],
      providers: [OrdersService]
    });
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    const requ = testController.expectOne(environment.api + 'order/kunde/0')
    expect(requ.request.method).toBe('GET');
    requ.flush(orders);

    expect(component).toBeTruthy();
  });
  it('shoudl get kund bestelungen ', () => {
    const requ = testController.expectOne(environment.api + 'order/kunde/0')
    expect(requ.request.method).toBe('GET');
    requ.flush([orders, 1]);
    fixture.detectChanges();
    const html = fixture.nativeElement.querySelectorAll('tr');
    expect(html.length).toBe(2);
    jest.spyOn(component, 'openInovice').mockReturnThis();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    expect(component.openInovice).toHaveBeenCalledTimes(1);
  });
  function setTestData() {
    orders = [];
    const order:iBestellung  = {
      kunde: {} as iUserData,
      produkte: [],
      bestelldatum: new Date('2022-02-01'),
      status: '',
      versand_datum: new Date('2022-02-02'),
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
  }
});
