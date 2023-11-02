import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWarehouseComponent } from './add-edit-warehouse.component';

describe('AddEditWarehouseComponent', () => {
  let component: AddEditWarehouseComponent;
  let fixture: ComponentFixture<AddEditWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditWarehouseComponent]
    });
    fixture = TestBed.createComponent(AddEditWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
