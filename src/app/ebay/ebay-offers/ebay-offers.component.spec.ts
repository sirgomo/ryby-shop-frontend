import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayOffersComponent } from './ebay-offers.component';

describe('EbayOffersComponent', () => {
  let component: EbayOffersComponent;
  let fixture: ComponentFixture<EbayOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EbayOffersComponent]
    });
    fixture = TestBed.createComponent(EbayOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
