import { TestBed } from '@angular/core/testing';

import { EbayOffersService } from './ebay-offers.service';

describe('EbayOffersService', () => {
  let service: EbayOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbayOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
