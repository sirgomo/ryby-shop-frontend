import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password.component';
import { ErrorService } from 'src/app/error/error.service';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { iNewPassword } from 'src/app/model/iNewPassword';
import {  Observable, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let userService: UserService;
  let authService: AuthService;
  let dialogRef: MatDialogRef<ChangePasswordComponent>;

  beforeEach(async () => {
    const userServiceMock = {
      changePassword: jest.fn().mockReturnValue(of(1)),
    };

    const authServiceMock = {
      getUserId: jest.fn().mockReturnValue(123),
    };

    const dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({

      providers: [
        FormBuilder,
        ErrorService,
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
      imports: [ChangePasswordComponent, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule]
    })
    .overrideComponent(ChangePasswordComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush },
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form: FormGroup = component.changePasswordForm;
    expect(form.get('oldPassword')?.value).toBe('');
    expect(form.get('newPassword')?.value).toBe('');
    expect(form.get('confirmPassword')?.value).toBe('');
  });

  it('should set the password mismatch error when passwords do not match', () => {
    const form: FormGroup = component.changePasswordForm;
    form.patchValue({
      newPassword: 'newPassword',
      confirmPassword: 'confirmPassword',
    });
    expect(form.hasError('mismatch')).toBe(true);
  });

  it('should not set the password mismatch error when passwords match', () => {
    const form: FormGroup = component.changePasswordForm;
    form.patchValue({
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
    expect(form.hasError('mismatch')).toBe(false);
  });

  it('should call changePassword method and close the dialog when form is submitted and valid', fakeAsync(() => {
    const form: FormGroup = component.changePasswordForm;
    form.patchValue({
      oldPassword: 'oldPassword',
      newPassword: 'newPassword*12',
      confirmPassword: 'newPassword*12',
    });
    form.markAsDirty();
    console.log(form)

    const pass: iNewPassword = {
      userid: 123,
      altPassword: 'oldPassword',
      newPassword: 'newPassword*12',
    };
    const changePasswordSpy = jest.spyOn(userService, 'changePassword').mockReturnValue(of(1));
    const closeSpy = jest.spyOn(dialogRef, 'close');

    let active$: Observable<any> | undefined;
    Object.defineProperty(component, 'active$', {
      get: () => active$,
      set: (value) => {
        active$ = value;
        if (active$) {
          active$.subscribe(() => {
            fixture.detectChanges();
            tick();
          });
        }
      },
    });

    component.onSubmit();

    component.active$ = of(1);

    tick();

    expect(changePasswordSpy).toHaveBeenCalledWith(pass);
    expect(closeSpy).toHaveBeenCalled();
  }));
  it('should not call changePassword method and close the dialog when form is submitted but invalid', () => {
    const form: FormGroup = component.changePasswordForm;
    form.patchValue({
      oldPassword: '',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
    const changePasswordSpy = jest.spyOn(userService, 'changePassword');
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.onSubmit();


    expect(changePasswordSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
