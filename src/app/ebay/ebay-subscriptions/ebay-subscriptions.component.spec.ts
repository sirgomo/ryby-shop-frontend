import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaySubscriptionsComponent } from './ebay-subscriptions.component';

describe('EbaySubscriptionsComponent', () => {
  let component: EbaySubscriptionsComponent;
  let fixture: ComponentFixture<EbaySubscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EbaySubscriptionsComponent]
    });
    fixture = TestBed.createComponent(EbaySubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
