import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRefundsComponent } from './all-refunds.component';

describe('AllRefundsComponent', () => {
  let component: AllRefundsComponent;
  let fixture: ComponentFixture<AllRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRefundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
