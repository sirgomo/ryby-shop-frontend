import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLiferantComponent } from './add-edit-liferant.component';

describe('AddEditLiferantComponent', () => {
  let component: AddEditLiferantComponent;
  let fixture: ComponentFixture<AddEditLiferantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditLiferantComponent]
    });
    fixture = TestBed.createComponent(AddEditLiferantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
