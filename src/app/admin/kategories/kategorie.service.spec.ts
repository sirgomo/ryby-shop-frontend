import { TestBed } from '@angular/core/testing';

import { KategorieService } from './kategorie.service';

describe('KategorieService', () => {
  let service: KategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KategorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
