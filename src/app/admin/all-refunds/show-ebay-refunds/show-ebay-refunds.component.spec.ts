import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEbayRefundsComponent } from './show-ebay-refunds.component';

describe('ShowEbayRefundsComponent', () => {
  let component: ShowEbayRefundsComponent;
  let fixture: ComponentFixture<ShowEbayRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowEbayRefundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowEbayRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
