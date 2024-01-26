import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUrlopComponent } from './add-urlop.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from '../../company/company.service';
import { iUrlop } from 'src/app/model/iUrlop';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';

describe('AddUrlopComponent', () => {
  let component: AddUrlopComponent;
  let fixture: ComponentFixture<AddUrlopComponent>;
  let testController: HttpTestingController;
  const urlop: iUrlop = {
    id: 0,
    is_in_urlop: false,
    urlop_from: new Date('2022-20-01'),
    urlop_to: new Date('2022-25-01'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUrlopComponent, CommonModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule,
         ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, HttpClientTestingModule, NoopAnimationsModule, MatMomentDateModule],
      providers: [
        CompanyService,
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: urlop,
        },

      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUrlopComponent);
    testController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call save method when save button is clicked', () => {
    jest.spyOn(component, 'save');
    const button = fixture.debugElement.nativeElement.querySelector('#save');
    button.click();
    expect(component.save).toHaveBeenCalled();
  });

  it('should close the dialog with the correct item when save is successful', () => {

    jest.spyOn(component.dialogRef, 'close');
    const butt = fixture.nativeElement.querySelector('#save');
    butt.click();
    fixture.detectChanges();
    const req = testController.expectOne(environment.api+'company/urlop/post');
    req.flush({ affected: 1 });
    expect(component.dialogRef.close).toHaveBeenCalledWith({...component.urlopForm.value, is_in_urlop: true });
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should not close the dialog when save is unsuccessful', () => {

    jest.spyOn(component.dialogRef, 'close');
    const butt = fixture.nativeElement.querySelector('#save');
    butt.click();
    fixture.detectChanges();
    const req = testController.expectOne(environment.api+'company/urlop/post');
    expect(req.request.method).toBe('POST');
    req.flush({ affected: 0 });
    expect(component.dialogRef.close).not.toHaveBeenCalled();
  });


  it('should bind form control inputs to component form group', () => {
    const urlopFromInput = fixture.debugElement.nativeElement.querySelector('input[formControlName="urlop_from"]');
    const urlopToInput = fixture.debugElement.nativeElement.querySelector('input[formControlName="urlop_to"]');

    const newFromDate = new Date('2022-01-20');
    const newToDate = new Date('2022-01-25');

    component.urlopForm.controls['urlop_from'].setValue(newFromDate);
    component.urlopForm.controls['urlop_to'].setValue(newToDate);

    fixture.detectChanges();
    expect(urlopFromInput.value).toBe('1/20/2022');
    expect(urlopToInput.value).toBe('1/25/2022');
  });


});
