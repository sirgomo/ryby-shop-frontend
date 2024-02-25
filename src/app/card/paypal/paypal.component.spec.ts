import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalComponent } from './paypal.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';

describe('PaypalComponent', () => {
  let component: PaypalComponent;
  let fixture: ComponentFixture<PaypalComponent>;
  let testController: HttpTestingController;
  let best: iBestellung;

  beforeEach(() => {
    best = {
      kunde: { id: 1} as iUserData,
      produkte: [],
      bestelldatum: new Date('2022-02-22'),
      status: '',
      versand_datum: new Date('2022-02-23'),
      zahlungsart: '',
      gesamtwert: 15,
      zahlungsstatus: '',
      bestellungstatus: BESTELLUNGSSTATUS.INBEARBEITUNG,
      versandart: '',
      versandprice: 0,
      varsandnr: '',
      paypal_order_id: '',
      refunds: [],
      shipping_address_json: '',
    };
    TestBed.configureTestingModule({
      imports: [PaypalComponent, MatDialogModule, MatProgressSpinnerModule, MatButtonModule, MatProgressSpinnerModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: best,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        }
      ],
    });
    fixture = TestBed.createComponent(PaypalComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    testController.verify();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
