import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { iUserData } from '../model/iUserData';
import { JwtModule } from '@auth0/angular-jwt';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';


describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;
  let dialog: MatDialog;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent, ChangePasswordComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        JwtModule.forRoot({}),
        MatDialogModule,
        MatButtonModule,
      ],
      providers: [MatDialog, DatePipe]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(UserComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      dialog = TestBed.inject(MatDialog);


      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call getUserDetails method', () => {
      const getUserDetailsSpy = jest.spyOn(userService, 'getUserDetails').mockReturnValue(
        of({
          id: 1,
          vorname: 'John',
          nachname: 'Doe',
          email: 'johndoe@example.com',
          telefon: '123456789',
          adresse: {
            strasse: 'Main St',
            hausnummer: '123',
            stadt: 'City',
            postleitzahl: '12345',
            land: 'Country',
          },
        } as iUserData)
      );

      component.ngOnInit();
      component.user$.subscribe(() => {})

      expect(getUserDetailsSpy).toHaveBeenCalled();
    });

    it('should update userForm with received user data', () => {
      const getUserDetailsSpy = jest.spyOn(userService, 'getUserDetails').mockReturnValue(
        of({
          id: 1,
          vorname: 'John',
          nachname: 'Doe',
          email: 'johndoe@example.com',
          telefon: '123456789',
          adresse: {
            strasse: 'Main St',
            hausnummer: '123',
            stadt: 'City',
            postleitzahl: '12345',
            land: 'Country',
          },
        } as iUserData)
      );

      component.ngOnInit();
      component.user$.subscribe(() => {})

      expect(getUserDetailsSpy).toHaveBeenCalled();
      expect(component.userForm.get('vorname')?.value).toEqual('John');
      expect(component.userForm.get('nachname')?.value).toEqual('Doe');
      expect(component.userForm.get('email')?.value).toEqual('johndoe@example.com');
      expect(component.userForm.get('telefon')?.value).toEqual('123456789');
      expect(component.userForm.get('adresseStrasse')?.value).toEqual('Main St');
      expect(component.userForm.get('adresseHausnummer')?.value).toEqual('123');
      expect(component.userForm.get('adresseStadt')?.value).toEqual('City');
      expect(component.userForm.get('adressePostleitzahl')?.value).toEqual('12345');
      expect(component.userForm.get('adresseLand')?.value).toEqual('Country');
    });

    it('should not update userForm if received user data is null', () => {
      const getUserDetailsSpy = jest.spyOn(userService, 'getUserDetails').mockReturnValue(  of({
        id: null,
        vorname: null,
        nachname: null,
      } as unknown as iUserData))

      component.ngOnInit();
      component.user$.subscribe(() => {})
      expect(getUserDetailsSpy).toHaveBeenCalled();
      expect(component.userForm.get('vorname')?.value).toEqual('');
      expect(component.userForm.get('nachname')?.value).toEqual('');
      expect(component.userForm.get('email')?.value).toEqual('');
      expect(component.userForm.get('telefon')?.value).toEqual('');
      expect(component.userForm.get('adresseStrasse')?.value).toEqual('');
      expect(component.userForm.get('adresseHausnummer')?.value).toEqual('');
      expect(component.userForm.get('adresseStadt')?.value).toEqual('');
      expect(component.userForm.get('adressePostleitzahl')?.value).toEqual('');
      expect(component.userForm.get('adresseLand')?.value).toEqual('');
    });
  });

  describe('updateUser', () => {
    it('should call updateUser method from userService with updated user data', () => {
      const getUserDetailsSpy = jest.spyOn(userService, 'getUserDetails').mockReturnValue(
        of({
          id: 1,
          vorname: 'John',
          nachname: 'Doe',
          email: 'johndoe@example.com',
          telefon: '123456789',
          adresse: {
            strasse: 'Main St',
            hausnummer: '123',
            stadt: 'City',
            postleitzahl: '12345',
            land: 'Country',
          },
        } as iUserData)
      );
      const updateUserSpy = jest.spyOn(userService, 'updateUser').mockImplementation(() => {
        return null as any
      })
      component.ngOnInit();
      component.user$.subscribe(() => {})
      component.userid = 1;
      component.updateUser();
      component.user$.subscribe(() => {})
      expect(updateUserSpy).toHaveBeenCalled();
    });

    it('should refresh the form with the updated user data', () => {
      const getUserDetailsSpy = jest.spyOn(userService, 'getUserDetails').mockReturnValue(
        of({
          id: 1,
          vorname: 'John',
          nachname: 'Doe',
          email: 'johndoe@example.com',
          telefon: '123456789',
          adresse: {
            strasse: 'Main St',
            hausnummer: '123',
            stadt: 'City',
            postleitzahl: '12345',
            land: 'Country',
          },
        } as iUserData)
      );

      const updateUserSpy = jest.spyOn(userService, 'updateUser').mockReturnValue(of({
        id: 1,
        vorname: 'John up',
        nachname: 'Doe up',
        email: 'johndoe@example.com up',
        telefon: '123456789 up',
        adresse: {
          strasse: 'Main St up',
          hausnummer: '123',
          stadt: 'City',
          postleitzahl: '12345',
          land: 'Country',
        },
      }))

      component.ngOnInit();
      component.user$.subscribe(() => {})
      component.updateUser();
      component.user$.subscribe(() => {})

      expect(getUserDetailsSpy).toHaveBeenCalled();
      expect(updateUserSpy).toHaveBeenCalledWith({
        id: 1,
        vorname: 'John',
        nachname: 'Doe',
        email: 'johndoe@example.com',
        telefon: '123456789',
        adresse: {
          strasse: 'Main St',
          hausnummer: '123',
          stadt: 'City',
          postleitzahl: '12345',
          land: 'Country',
        },
      } as iUserData);
      expect(component.userForm.get('vorname')?.value).toEqual('John up');
      expect(component.userForm.get('nachname')?.value).toEqual('Doe up');
      expect(component.userForm.get('email')?.value).toEqual('johndoe@example.com up');
      expect(component.userForm.get('telefon')?.value).toEqual('123456789 up');
      expect(component.userForm.get('adresseStrasse')?.value).toEqual('Main St up');
      expect(component.userForm.get('adresseHausnummer')?.value).toEqual('123');
      expect(component.userForm.get('adresseStadt')?.value).toEqual('City');
      expect(component.userForm.get('adressePostleitzahl')?.value).toEqual('12345');
      expect(component.userForm.get('adresseLand')?.value).toEqual('Country');
    });
  });

  describe('changePassword', () => {
    it('should open the change password dialog', () => {
      const openSpy = jest.spyOn(dialog, 'open').mockReturnValueOnce({} as MatDialogRef<ChangePasswordComponent>);
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.height = '400px';
      dialogConfig.width = '400px';

      component.changePassword();

      expect(openSpy).toHaveBeenCalledWith(ChangePasswordComponent, dialogConfig);
    });
  });

  it('should call update on button click', () => {
    const updateUserSpy = jest.spyOn(component, 'updateUser');
    component.user$.subscribe(() => {})
    fixture.detectChanges();
    const updateButton = fixture.debugElement.query(By.css('#upuser'));

    updateButton.triggerEventHandler('click', null);

    expect(updateUserSpy).toHaveBeenCalled();
  });

  it('should call change password method on button click', () => {
    const changePasswordSpy = jest.spyOn(component, 'changePassword');
    const userData: iUserData = {
      id: 1,
      vorname: 'John',
      nachname: 'Doe',
      email: 'johndoe@example.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Main St',
        hausnummer: '123',
        stadt: 'City',
        postleitzahl: '12345',
        land: 'Country',
      },
    };
    const getDet =  jest.spyOn(userService, 'getUserDetails').mockReturnValue(
      of(userData)
    );

    const openSpy = jest.spyOn(dialog, 'open').mockReturnValueOnce({} as MatDialogRef<ChangePasswordComponent>);
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.height = '400px';
    dialogConfig.width = '400px';

    component.ngOnInit();
    component.user$.subscribe((res) => {
      return userData;
    })
    fixture.detectChanges();
    const changePasswordButton = fixture.debugElement.query(By.css('#cpass'));
    console.log(fixture.debugElement);
    changePasswordButton.triggerEventHandler('click', null);

    expect(getDet).toHaveBeenCalled();
    expect(changePasswordSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(ChangePasswordComponent, dialogConfig);
  });
});
