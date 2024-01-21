import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEbayimageComponent } from './input-ebayimage.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('InputEbayimageComponent', () => {
  let component: InputEbayimageComponent;
  let fixture: ComponentFixture<InputEbayimageComponent>;
  let testControl: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEbayimageComponent, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, MatIconModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            sku: 'sjdashd',
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn((res) => res),
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          }
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputEbayimageComponent);
    component = fixture.componentInstance;
    testControl = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testControl.verify();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close dialog with null when closeDialog is called', () => {
    component.closeDialog();
    expect(component.dialRef.close).toHaveBeenCalledWith(null);
  });

  it('should open snackbar and not close dialog if saveEbayImageLink fails', () => {

    jest.spyOn(component, 'close');
    const hostElement = fixture.nativeElement;
    const buttonElement: HTMLButtonElement = hostElement.querySelector('button[color="primary"]');

    buttonElement.click();
    fixture.detectChanges();

    const requ = testControl.expectOne(environment.api + 'variation/imagelink');
    expect(requ.request.method).toBe('POST');
    requ.flush(null);

    component.close();

    expect(component.snack.open).toHaveBeenCalledWith('Etwas ist sichefgelaufen, item wurde nicht gefunden!', 'Ok', { duration: 2000 });
    expect(component.dialRef.close).not.toHaveBeenCalled();
  });

  it('should bind input field to component link property', () => {
    const hostElement = fixture.nativeElement;
    const inputElement: HTMLInputElement = hostElement.querySelector('input[type="text"]');
    const testLink = 'http://newexample.com/image.jpg';

    inputElement.value = testLink;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.link).toBe(testLink);
  });

  it('should call close method when save button is clicked', () => {
    jest.spyOn(component, 'close');
    const hostElement = fixture.nativeElement;
    const buttonElement: HTMLButtonElement = hostElement.querySelector('button[color="primary"]');

    buttonElement.click();
    fixture.detectChanges();

    const requ = testControl.expectOne(environment.api + 'variation/imagelink');
    expect(requ.request.method).toBe('POST');
    requ.flush({});

    expect(component.close).toHaveBeenCalled();
  });
});
