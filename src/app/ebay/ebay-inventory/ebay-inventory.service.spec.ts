import { TestBed } from '@angular/core/testing';

import { EbayInventoryService } from './ebay-inventory.service';

describe('EbayInventoryService', () => {
  let service: EbayInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbayInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
