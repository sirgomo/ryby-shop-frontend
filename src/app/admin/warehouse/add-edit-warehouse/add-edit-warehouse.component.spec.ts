import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AddEditWarehouseComponent } from './add-edit-warehouse.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorComponent } from 'src/app/error/error.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iLager } from 'src/app/model/iLager';
import { WarehouseService } from '../warehouse.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ErrorService } from 'src/app/error/error.service';

describe('AddEditWarehouseComponent', () => {
  let component: AddEditWarehouseComponent;
  let fixture: ComponentFixture<AddEditWarehouseComponent>;
  let httpController: HttpTestingController;
  let error: ErrorService;
  let wservice: WarehouseService
  let warehaouse:iLager = {
    id: 1,
    name: 'Test Warehouse',
    adresse: 'Test Address',
    lagerorte: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditWarehouseComponent, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
         MatButtonModule, ErrorComponent, HttpClientTestingModule, NoopAnimationsModule],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: warehaouse,
          },
          {
            provide: MatDialogRef,
            useValue: {
              close: jest.fn(),
            }
          },
          WarehouseService,
          ErrorService,
        ]
    });
    fixture = TestBed.createComponent(AddEditWarehouseComponent);
    component = fixture.componentInstance;
    wservice = TestBed.inject(WarehouseService);
    error = TestBed.inject(ErrorService);
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    httpController.verify();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have the correct title when data is provided', () => {

    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Lagerort ändern');
  });

  it('should have the correct title when no data is provided', () => {

    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Lagerort ändern');
  });


  it('name field validity', () => {


    let name = component.lagerForm.controls['name'];


    name.setValue("");
    fixture.detectChanges();
    expect(name.valid).toBeFalsy();
    expect(name.hasError('required')).toBeTruthy();
  });

  it('adresse field validity', () => {
    component.data = null as unknown as iLager;
    fixture.detectChanges();
    let adresse = component.lagerForm.controls['adresse'];


    adresse.setValue("");
    fixture.detectChanges();
    expect(adresse.valid).toBeFalsy();
    expect(adresse.hasError('required')).toBeTruthy();
  });

  it('should call onSubmit method when form is submitted', () => {
    jest.spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should close dialog and reset form on successful submit when creating new warehouse', () => {
    jest.spyOn(component.ref, 'close');
    component.data = null as unknown as iLager; // Simulate new warehouse
    fixture.detectChanges();
    component.lagerForm.controls['name'].setValue('New Warehouse');
    component.lagerForm.controls['adresse'].setValue('New Address');
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();

    expect(component.ref.close).toHaveBeenCalled();
    expect(component.lagerForm.pristine).toBeTruthy();
  })

  it('should not close dialog on unsuccessful submit when creating new warehouse', fakeAsync(() => {
    jest.spyOn(component.ref, 'close');
    component.data = null as unknown as iLager; // Simulate new warehouse
    fixture.detectChanges();
    component.lagerForm.controls['name'].setValue('');
    component.lagerForm.controls['adresse'].setValue('');
    component.onSubmit();
    tick();
    expect(component.ref.close).not.toHaveBeenCalled();
  }));

  it('should close dialog and reset form on successful submit when updating warehouse', () => {
    jest.spyOn(component.ref, 'close');

    fixture.detectChanges();
    component.lagerForm.controls['name'].setValue('Updated Warehouse');
    component.lagerForm.controls['adresse'].setValue('Updated Address');
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();
    expect(component.ref.close).toHaveBeenCalled();
    expect(component.lagerForm.pristine).toBeTruthy();
  });

  it('should not close dialog on unsuccessful submit when updating warehouse', fakeAsync(() => {
    jest.spyOn(component.ref, 'close');

    fixture.detectChanges();
    component.lagerForm.controls['name'].setValue('');
    component.lagerForm.controls['adresse'].setValue('');
    component.onSubmit();
    tick();
    expect(component.ref.close).not.toHaveBeenCalled();
  }));

  it('should display error message when error service has a message', () => {
    error.newMessage('Test error message');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error').textContent).toContain('Test error message');
  });
});
