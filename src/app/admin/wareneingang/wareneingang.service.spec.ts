import { TestBed } from '@angular/core/testing';

import { WareneingangService } from './wareneingang.service';

describe('WareneingangService', () => {
  let service: WareneingangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WareneingangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
