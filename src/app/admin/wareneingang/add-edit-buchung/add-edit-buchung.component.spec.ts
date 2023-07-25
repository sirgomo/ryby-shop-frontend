import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBuchungComponent } from './add-edit-buchung.component';

describe('AddEditBuchungComponent', () => {
  let component: AddEditBuchungComponent;
  let fixture: ComponentFixture<AddEditBuchungComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditBuchungComponent]
    });
    fixture = TestBed.createComponent(AddEditBuchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
