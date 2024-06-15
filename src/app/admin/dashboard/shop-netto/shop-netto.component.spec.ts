import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopNettoComponent } from './shop-netto.component';

describe('ShopNettoComponent', () => {
  let component: ShopNettoComponent;
  let fixture: ComponentFixture<ShopNettoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopNettoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopNettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
