import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayDetailsComponent } from './ebay-details.component';

describe('EbayDetailsComponent', () => {
  let component: EbayDetailsComponent;
  let fixture: ComponentFixture<EbayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
