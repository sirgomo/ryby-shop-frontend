import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayProductComponent } from './ebay-product.component';

describe('EbayProductComponent', () => {
  let component: EbayProductComponent;
  let fixture: ComponentFixture<EbayProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
