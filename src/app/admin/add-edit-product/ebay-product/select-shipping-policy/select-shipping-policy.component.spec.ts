import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShippingPolicyComponent } from './select-shipping-policy.component';

describe('SelectShippingPolicyComponent', () => {
  let component: SelectShippingPolicyComponent;
  let fixture: ComponentFixture<SelectShippingPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectShippingPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectShippingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
