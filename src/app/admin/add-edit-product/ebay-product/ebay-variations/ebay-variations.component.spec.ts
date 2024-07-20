import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayVariationsComponent } from './ebay-variations.component';

describe('EbayVariationsComponent', () => {
  let component: EbayVariationsComponent;
  let fixture: ComponentFixture<EbayVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayVariationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
