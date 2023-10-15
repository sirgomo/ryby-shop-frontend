import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationsComponent } from './variations.component';

describe('VariationsComponent', () => {
  let component: VariationsComponent;
  let fixture: ComponentFixture<VariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VariationsComponent]
    });
    fixture = TestBed.createComponent(VariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
