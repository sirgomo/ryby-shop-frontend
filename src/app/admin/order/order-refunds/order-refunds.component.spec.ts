import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRefundsComponent } from './order-refunds.component';

describe('OrderRefundsComponent', () => {
  let component: OrderRefundsComponent;
  let fixture: ComponentFixture<OrderRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRefundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
