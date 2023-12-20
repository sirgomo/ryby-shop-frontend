import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEbayimageComponent } from './input-ebayimage.component';

describe('InputEbayimageComponent', () => {
  let component: InputEbayimageComponent;
  let fixture: ComponentFixture<InputEbayimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEbayimageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputEbayimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
