import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowRefundComponent } from './show-refund.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { iRefunds } from 'src/app/model/iRefund';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';

describe('ShowRefundComponent', () => {
  let component: ShowRefundComponent;
  let fixture: ComponentFixture<ShowRefundComponent>;
  const refund: iRefunds = {
    orderId: 'ashdajdh3123',
    creationDate: new Date('2022-02-01'),
    reason: 'piwko jkashda',
    comment: 'ajsdhajksd',
    amount: 12.22,
    transaction: {} as iEbayTransaction,
    refund_items: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRefundComponent, MatDialogModule, MatButtonModule, NoopAnimationsModule],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: refund,
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRefundComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });
  afterEach(()=> {
    jest.resetAllMocks();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Verify that the data is displayed correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-testid="order-id"]')?.textContent).toContain(refund.orderId);
    expect(compiled.querySelector('[data-testid="creation-date"]')?.textContent).toContain(refund.creationDate.toDateString());
    expect(compiled.querySelector('[data-testid="reason"]')?.textContent).toContain(refund.reason);
    expect(compiled.querySelector('[data-testid="comment"]')?.textContent).toContain(refund.comment);
    expect(compiled.querySelector('[data-testid="amount"]')?.textContent).toContain(refund.amount.toString());
  })
});
