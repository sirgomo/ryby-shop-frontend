import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEbayListingsComponent } from './import-ebay-listings.component';

describe('ImportEbayListingsComponent', () => {
  let component: ImportEbayListingsComponent;
  let fixture: ComponentFixture<ImportEbayListingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImportEbayListingsComponent]
    });
    fixture = TestBed.createComponent(ImportEbayListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
