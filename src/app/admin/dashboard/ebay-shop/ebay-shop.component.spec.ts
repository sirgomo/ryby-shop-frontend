import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayShopComponent } from './ebay-shop.component';

describe('EbayShopComponent', () => {
  let component: EbayShopComponent;
  let fixture: ComponentFixture<EbayShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
