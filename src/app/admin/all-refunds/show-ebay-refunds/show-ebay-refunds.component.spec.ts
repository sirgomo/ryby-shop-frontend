import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEbayRefundsComponent } from './show-ebay-refunds.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RefundService } from 'src/app/ebay/refund/refund.service';
import { environment } from 'src/environments/environment';
import { iRefunds } from 'src/app/model/iRefund';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';

describe('ShowEbayRefundsComponent', () => {
  let component: ShowEbayRefundsComponent;
  let fixture: ComponentFixture<ShowEbayRefundsComponent>;
  let testController: HttpTestingController;
  let refunds: iRefunds[];

  beforeEach(async () => {
    setTestData();
    await TestBed.configureTestingModule({
      imports: [ShowEbayRefundsComponent, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        RefundService,
      ],
    })
    .compileComponents();
    if(window)
      window.confirm = jest.fn(),
    fixture = TestBed.createComponent(ShowEbayRefundsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  });
  it('should create', () => {
    const req = testController.expectOne(environment.api + 'refund/null/1/0');
    expect(req.request.method).toBe('GET');
    req.flush(refunds);
    expect(component).toBeTruthy();
  });
  it('should be 1 refund', () => {
    const req = testController.expectOne(environment.api + 'refund/null/1/0');
    expect(req.request.method).toBe('GET');
    req.flush([refunds, 1]);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('tr');
    expect(items.length).toBe(2);
  });
  it('should open refund', () => {
    const req = testController.expectOne(environment.api + 'refund/null/1/0');
    jest.spyOn(component, 'openRefund');
    expect(req.request.method).toBe('GET');
    req.flush([refunds, 1]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll('button')[0];
    button.click();

    expect(component.openRefund).toHaveBeenLastCalledWith({
      orderId: 'ashgdbas',
      creationDate: new Date('2022-02-01'),
      reason: 'kasjdlasjd',
      comment: 'ajsahsdh',
      amount: 11.50,
      transaction: {} as iEbayTransaction,
      refund_items: []
    });
  });
  it('should click delete', () => {
    const req = testController.expectOne(environment.api + 'refund/null/1/0');
    jest.spyOn(component, 'delete');
    expect(req.request.method).toBe('GET');
    req.flush([refunds, 1]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll('button')[1];
    button.click();

    expect(component.delete).toHaveBeenCalled();
  })
  function setTestData() {
    refunds = [];
    const refund:iRefunds = {
      orderId: 'ashgdbas',
      creationDate: new Date('2022-02-01'),
      reason: 'kasjdlasjd',
      comment: 'ajsahsdh',
      amount: 11.50,
      transaction: {} as iEbayTransaction,
      refund_items: []
    };
    refunds.push(refund);
  }
});
