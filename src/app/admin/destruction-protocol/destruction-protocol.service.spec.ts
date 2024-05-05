import { TestBed } from '@angular/core/testing';

import { DestructionProtocolService } from './destruction-protocol.service';

describe('DestructionProtocolService', () => {
  let service: DestructionProtocolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestructionProtocolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
