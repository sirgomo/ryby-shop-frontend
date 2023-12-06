import { TestBed } from '@angular/core/testing';

import { OrderRefundsService } from './order-refunds.service';

describe('OrderRefundsService', () => {
  let service: OrderRefundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderRefundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
