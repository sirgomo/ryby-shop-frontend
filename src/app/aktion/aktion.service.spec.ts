import { TestBed } from '@angular/core/testing';

import { AktionService } from './aktion.service';

describe('AktionService', () => {
  let service: AktionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AktionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
