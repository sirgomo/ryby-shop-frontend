import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { UserService } from 'src/app/user/user.service';
import { ShippingAddressComponent } from './shipping-address.component';
import { iUserData } from 'src/app/model/iUserData';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { iShippingAddress } from 'src/app/model/iShippingAddress';

describe('ShippingAddressComponent', () => {
  let component: ShippingAddressComponent;
  let fixture: ComponentFixture<ShippingAddressComponent>;
  let helperService: HelperService;
  let userService: UserService;
  let snack: MatSnackBar;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [ShippingAddressComponent],
      imports: [ReactiveFormsModule, FormsModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, HttpClientTestingModule, JwtModule.forRoot({})],
      providers: [
        { provide: HelperService, useValue: { isLogged: jest.fn() } },
       UserService,
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents()
    .then(() => {
    fixture = TestBed.createComponent(ShippingAddressComponent);
    component = fixture.componentInstance;
    helperService = TestBed.inject(HelperService);
    userService = TestBed.inject(UserService);
    snack = TestBed.inject(MatSnackBar);

    jest.spyOn(helperService, 'isLogged').mockReturnValue(true);
    jest.spyOn(userService, 'getUserDetails').mockReturnValue(of({} as iUserData));
  })}));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display count of the form fields', () => {
    fixture.detectChanges();
    const formFields = fixture.debugElement.queryAll(By.css('input[formControlName]'));
    expect(formFields.length).toBe(7);
  });

  it('should display count of the form fields when isRechnungAddress is true', () => {
    component.isRechnungAddress = true;
    fixture.detectChanges();
    const formFields = fixture.debugElement.queryAll(By.css('input[formControlName]'));
    expect(formFields.length).toBe(13);
  });


  it('should enable the "Bestellen" button when the form is valid', () => {
    fixture.detectChanges();
    component.shippingAddres.patchValue({
      shipping_name: 'John Doe',
      strasse: '123 Main St',
      hausnummer: '1A',
      email: 'john@example.com',
      stadt: 'New York',
      postleitzahl: '12345',
      land: 'USA',
    });
    component.rechnungAddress.patchValue({
      shipping_name: 'John Doe',
      strasse: '123 Main St',
      hausnummer: '1A',
      stadt: 'New York',
      postleitzahl: '12345',
      land: 'USA',
    });
    fixture.detectChanges();
    const bestellenButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    expect(bestellenButton.disabled).toBeFalsy();
  });

  it('should disable the "Bestellen" button when the form is invalid', () => {
    fixture.detectChanges();
    component.shippingAddres.patchValue({
      shipping_name: '',
      strasse: '',
      hausnummer: '',
      email: '',
      stadt: '',
      postleitzahl: '',
      land: '',
    });
    fixture.detectChanges();
    const bestellenButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    expect(bestellenButton.disabled).toBeTruthy();
  });

  it('should call makeBestellung method when the "Bestellen" button is clicked', () => {
    component.act$.subscribe();
    fixture.detectChanges();
    const shipAddres  = {
      shipping_name: 'John Doe',
      strasse: '123 Main St',
      hausnummer: '1A',
      email: 'john@example.com',
      stadt: 'New York',
      postleitzahl: '12345',
      land: 'USA',
    };
    component.shippingAddres.patchValue(shipAddres);
    component.isRechnungAddress = false;

    jest.spyOn(component, 'makeBestellung').mockImplementation();
    fixture.detectChanges();
    const bestellenButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;

    bestellenButton.click();
    expect(component.shippingAddres.valid).toBeTruthy();
    expect(component.rechnungAddress.valid).toBeFalsy();
    expect(bestellenButton.disabled).toBeFalsy();
    expect(component.makeBestellung).toHaveBeenCalled();
  });

  it('should set diabled on "Bestellen" button ', () => {
    fixture.detectChanges();

    const bestellenButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    expect(bestellenButton.disabled).toBeTruthy();


  });
});
