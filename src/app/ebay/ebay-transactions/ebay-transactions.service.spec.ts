import { TestBed } from '@angular/core/testing';

import { EbayTransactionsService } from './ebay-transactions.service';

describe('EbayTransactionsService', () => {
  let service: EbayTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbayTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
