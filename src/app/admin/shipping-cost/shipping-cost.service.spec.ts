import { TestBed } from '@angular/core/testing';

import { ShippingCostService } from './shipping-cost.service';

describe('ShippingCostService', () => {
  let service: ShippingCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
