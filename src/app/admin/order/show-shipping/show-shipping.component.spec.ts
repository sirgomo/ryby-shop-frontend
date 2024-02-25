import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowShippingComponent } from './show-shipping.component';

describe('ShowShippingComponent', () => {
  let component: ShowShippingComponent;
  let fixture: ComponentFixture<ShowShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowShippingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
