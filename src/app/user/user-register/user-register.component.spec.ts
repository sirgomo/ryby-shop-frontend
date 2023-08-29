import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserRegisterComponent } from './user-register.component';
import { UserService } from '../user.service';
import { map, of, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { marbles } from 'rxjs-marbles/jest';
import { JwtModule } from '@auth0/angular-jwt';
import { iUserData } from 'src/app/model/iUserData';
import { iRegisterUser } from 'src/app/model/iRegisterUser';



describe('UserRegisterComponent', () => {
  let component: UserRegisterComponent;
  let fixture: ComponentFixture<UserRegisterComponent>;
  let userService: UserService;
  let dialogRef: MatDialogRef<UserRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, BrowserAnimationsModule,FormsModule, ReactiveFormsModule, HttpClientTestingModule, MatIconModule, MatInputModule,
        MatCheckboxModule, MatFormFieldModule, MatSnackBarModule, JwtModule.forRoot({})],
      declarations: [UserRegisterComponent],
      providers: [
        UserService,
        DatePipe,
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send data to server', marbles((m) => {
    const data: iRegisterUser = {
      vorname: 'John',
      nachname: 'Doe',
      password: 'Password123!',
      email: 'john.doe@example.com',
      telefon: '123456789',
      role: 'user',
      registrierungsdatum: '',
      treuepunkte: 0,
      l_strasse: 'null',
      l_hausnummer: 'null',
      l_stadt: 'null',
      l_postleitzahl: 'null',
      l_land: 'null',
      adresseStrasse: 'Example Street',
      adresseHausnummer: '123',
      adresseStadt: 'Example City',
      adressePostleitzahl: '12345',
      adresseLand: 'Example Country',
      shipping_name: ''
    };
    const resp: iUserData = {
      id: 1,
      vorname: 'John',
      nachname: 'Doe',
      email: 'john.doe@example.com',
      telefon: '123456789',
      treuepunkte: 0,
      adresse: {
        strasse: 'Example Street',
        hausnummer: '123',
        stadt: 'Example City',
        postleitzahl: '12345',
        land: 'Example Country',
      },
    }

    const userServiceSpy = jest.spyOn(userService, 'createUser').mockReturnValue(of(resp));
    component.sendDataToServer(data);
    expect(component.regSig$).toBeTruthy();
    expect(userServiceSpy).toHaveBeenCalled();
    m.expect(component.regSig$).toBeObservable(m.cold('(a|)', { a: resp }));
    m.flush();
  }));

  it('should close dialog', () => {
    component.abbrechen();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
