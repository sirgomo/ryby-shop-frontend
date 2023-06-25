import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKategorieComponent } from './add-edit-kategorie.component';

describe('AddEditKategorieComponent', () => {
  let component: AddEditKategorieComponent;
  let fixture: ComponentFixture<AddEditKategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditKategorieComponent]
    });
    fixture = TestBed.createComponent(AddEditKategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
