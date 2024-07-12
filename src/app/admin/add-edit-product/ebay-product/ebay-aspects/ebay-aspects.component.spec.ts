import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayAspectsComponent } from './ebay-aspects.component';

describe('EbayAspectsComponent', () => {
  let component: EbayAspectsComponent;
  let fixture: ComponentFixture<EbayAspectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayAspectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayAspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
