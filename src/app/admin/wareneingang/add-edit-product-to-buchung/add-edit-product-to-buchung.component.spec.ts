import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductToBuchungComponent } from './add-edit-product-to-buchung.component';

describe('AddEditProductToBuchungComponent', () => {
  let component: AddEditProductToBuchungComponent;
  let fixture: ComponentFixture<AddEditProductToBuchungComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditProductToBuchungComponent]
    });
    fixture = TestBed.createComponent(AddEditProductToBuchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
