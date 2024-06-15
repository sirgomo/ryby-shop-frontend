import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopMonthsComponent } from './shop-months.component';

describe('ShopMonthsComponent', () => {
  let component: ShopMonthsComponent;
  let fixture: ComponentFixture<ShopMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopMonthsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
