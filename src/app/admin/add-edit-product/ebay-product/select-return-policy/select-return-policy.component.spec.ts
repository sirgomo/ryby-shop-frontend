import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReturnPolicyComponent } from './select-return-policy.component';

describe('SelectReturnPolicyComponent', () => {
  let component: SelectReturnPolicyComponent;
  let fixture: ComponentFixture<SelectReturnPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectReturnPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectReturnPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
