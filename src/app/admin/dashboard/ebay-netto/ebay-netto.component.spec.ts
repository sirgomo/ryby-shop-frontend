import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayNettoComponent } from './ebay-netto.component';

describe('EbayNettoComponent', () => {
  let component: EbayNettoComponent;
  let fixture: ComponentFixture<EbayNettoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayNettoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayNettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
