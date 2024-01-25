import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AddEditKategorieComponent } from './add-edit-kategorie.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KategorieService } from '../kategories/kategorie.service';
import { Observable, delay, of } from 'rxjs';
import { iKategorie } from 'src/app/model/iKategorie';


describe('AddEditKategorieComponent', () => {
  let component: AddEditKategorieComponent;
  let fixture: ComponentFixture<AddEditKategorieComponent>;
  let dialogRef: MatDialogRef<AddEditKategorieComponent>;
  let kategorieService: KategorieService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditKategorieComponent, MatDialogModule, HttpClientTestingModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, MatSelectModule, MatInputModule, BrowserAnimationsModule],
      providers: [  { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        KategorieService],
    }).compileComponents();
    fixture = TestBed.createComponent(AddEditKategorieComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    kategorieService = TestBed.inject(KategorieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with data if provided', () => {
    const data = {
      id: 1, parent_id: 2, name: 'Category Name',
    };
    component.data = data as iKategorie;
    component.kategorieForm.patchValue(data);
    fixture.detectChanges();

    expect(component.kategorieForm.value).toEqual(data);
  });

  it('should initialize the form with default values if no data is provided', () => {
    expect(component.kategorieForm.value).toEqual({ id: null, parent_id: null, name: '' });
  });

  it('should close the dialog on cancel click', () => {
    jest.spyOn(dialogRef, 'close');

    component.onCancelClick();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should save the category and close the dialog on save click for new category', fakeAsync( () => {
    const data = {
      id: 1, parent_id: 2, name: 'Category Name',
    };
    component.data = null;
    jest.spyOn(dialogRef, 'close');
    jest.spyOn(kategorieService, 'createCategory').mockReturnValue(of([data as iKategorie] as iKategorie[]));

    component.kategorieForm.setValue(data);

    component.onSaveClick();

    tick();
    fixture.detectChanges();
    console.log(component.kategorieForm)
    expect(kategorieService.createCategory).toHaveBeenCalledWith(data);
    expect(dialogRef.close).toHaveBeenCalled();
  }));

  it('should update the category and close the dialog on save click for existing category', fakeAsync( () => {
    const formData = {
      id: 1, parent_id: 2, name: 'Category Name',

    };
    const existingData  = {
      id: 1, parent_id: 2, name: 'Existing Category',

    };
    jest.spyOn(dialogRef, 'close');
   const tmp =  jest.spyOn(kategorieService, 'updateCategory').mockReturnValue(of([formData,existingData] as iKategorie[]));
    component.data = existingData as iKategorie;

    component.kategorieForm.setValue(formData);
    component.onSaveClick();
    tick();
    fixture.detectChanges();
    expect(kategorieService.updateCategory).toHaveBeenCalledWith(formData.id, formData as iKategorie);
    expect(dialogRef.close).toHaveBeenCalled();
  }));
});
class MatDialogRefMock {
  close() {}
}
