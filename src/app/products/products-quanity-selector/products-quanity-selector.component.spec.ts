import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsQuanitySelectorComponent } from './products-quanity-selector.component';

describe('ProductsQuanitySelectorComponent', () => {
  let component: ProductsQuanitySelectorComponent;
  let fixture: ComponentFixture<ProductsQuanitySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsQuanitySelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsQuanitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
