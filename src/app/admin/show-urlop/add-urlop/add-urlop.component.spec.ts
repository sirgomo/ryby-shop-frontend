import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUrlopComponent } from './add-urlop.component';

describe('AddUrlopComponent', () => {
  let component: AddUrlopComponent;
  let fixture: ComponentFixture<AddUrlopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUrlopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUrlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
