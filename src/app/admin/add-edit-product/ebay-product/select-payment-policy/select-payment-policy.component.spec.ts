import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentPolicyComponent } from './select-payment-policy.component';

describe('SelectPaymentPolicyComponent', () => {
  let component: SelectPaymentPolicyComponent;
  let fixture: ComponentFixture<SelectPaymentPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPaymentPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPaymentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
