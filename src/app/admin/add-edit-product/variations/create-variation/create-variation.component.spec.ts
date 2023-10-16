import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariationComponent } from './create-variation.component';

describe('CreateVariationComponent', () => {
  let component: CreateVariationComponent;
  let fixture: ComponentFixture<CreateVariationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateVariationComponent]
    });
    fixture = TestBed.createComponent(CreateVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
