import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayTransactionsComponent } from './ebay-transactions.component';

describe('EbayTransactionsComponent', () => {
  let component: EbayTransactionsComponent;
  let fixture: ComponentFixture<EbayTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EbayTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
