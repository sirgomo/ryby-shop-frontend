import { TestBed } from '@angular/core/testing';

import { LiferantsService } from './liferants.service';

describe('LiferantsService', () => {
  let service: LiferantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiferantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
