import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundComponent } from './refund.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from 'src/app/error/error.component';
import { EbayTransactionsService } from '../ebay-transactions/ebay-transactions.service';
import { RefundService } from './refund.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';
import { iEbayTransactionItem } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransactionItem';
import { By } from '@angular/platform-browser';

describe('RefundComponent', () => {
  let component: RefundComponent;
  let fixture: ComponentFixture<RefundComponent>;
  let testController: HttpTestingController;
  let data = {
    orderId: '1',
  };
  let ebayTrans: iEbayTransaction;

  beforeEach(async () => {
    setDataTest();
    await TestBed.configureTestingModule({
      imports: [RefundComponent, CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, ErrorComponent, MatInputModule, MatIconModule, MatIconModule, MatButtonModule,
        MatSelectModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        EbayTransactionsService,
        RefundService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: data,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    const requ = testController.expectOne(environment.api + 'ebay-sold/1');
    expect(requ.request.method).toBe('GET');
    requ.flush(ebayTrans);

    expect(component).toBeTruthy();

  });
  it('should load items from transaction',  () => {
    jest.spyOn(component, 'addRefundItem');//.mockImplementationOnce((item) => item);
    const testransItem: iEbayTransactionItem = {
      title: 'duap',
      sku: 'sjkahd123789',
      quanity: 1,
      price: 2.3,
      transaction: {} as iEbayTransaction,
    };
    const requ = testController.expectOne(environment.api + 'ebay-sold/1');
    expect(requ.request.method).toBe('GET');
    requ.flush(ebayTrans);

    expect(component.addRefundItem).toHaveBeenCalledTimes(1);
    expect(component.addRefundItem).toHaveBeenCalledWith(testransItem);
  });
  it('should add array form and display it', async  () => {
    const requ = testController.expectOne(environment.api + 'ebay-sold/1');
    expect(requ.request.method).toBe('GET');
    requ.flush(ebayTrans);
    fixture.detectChanges();
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.row');
    expect(items.length).toBe(1);
  });
  it('should submit refund', async  ()=> {
    const requ = testController.expectOne(environment.api + 'ebay-sold/1');
    jest.spyOn(component, 'submitRefund');
    jest.spyOn(component, 'close');
    expect(requ.request.method).toBe('GET');
    requ.flush(ebayTrans);
    fixture.detectChanges();

    component.refundForm.get('reason')?.patchValue(' dupa zbita');
    component.refundForm.get('comment')?.patchValue('comment');
    component.refundForm.get('amount')?.patchValue(12.25);
    await fixture.whenStable();
    const butt = fixture.nativeElement.querySelectorAll('button')[1];
    const form = fixture.debugElement.query(By.css('#form'));

    butt.click();
    form.triggerEventHandler('submit', {});
    fixture.detectChanges();

    const requ2 = testController.expectOne(environment.api+'refund');
    expect(requ2.request.method).toBe('POST');
    requ2.flush([{id:1}])
    await fixture.whenStable();
    expect(component.refundForm.valid).toBeTruthy();
    expect(component.submitRefund).toHaveBeenCalledTimes(1);
    expect(component.close).toHaveBeenCalled();
  })
  function setDataTest() {
    const transItem: iEbayTransactionItem = {
      title: 'duap',
      sku: 'sjkahd123789',
      quanity: 1,
      price: 2.3,
      transaction: {} as iEbayTransaction,
    };
    ebayTrans  = {
      orderId: '1',
      creationDate: new Date(Date.now()),
      price_total: 2,
      price_shipping: 1.6,
      price_tax: 0,
      price_discont: 0,
      sel_amount: 1,
      payment_status: 'DONE',
      items: [transItem],
      refunds: []
    };
  }
});
