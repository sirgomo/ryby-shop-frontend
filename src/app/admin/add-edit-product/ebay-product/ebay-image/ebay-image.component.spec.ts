import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayImageComponent } from './ebay-image.component';

describe('EbayImageComponent', () => {
  let component: EbayImageComponent;
  let fixture: ComponentFixture<EbayImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
