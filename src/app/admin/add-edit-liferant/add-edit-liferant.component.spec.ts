import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEditLiferantComponent } from './add-edit-liferant.component';
import { LiferantsService } from '../liferants/liferants.service';
import { ErrorService } from 'src/app/error/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { iLieferant } from 'src/app/model/iLieferant';
import { of } from 'rxjs';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';

describe('AddEditLiferantComponent', () => {
  let component: AddEditLiferantComponent;
  let fixture: ComponentFixture<AddEditLiferantComponent>;
  let liferantsService: LiferantsService;
  let dialogRef: MatDialogRef<AddEditLiferantComponent>;
  let error: ErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditLiferantComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      providers: [
        LiferantsService,
        ErrorService,
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditLiferantComponent);
    component = fixture.componentInstance;
    liferantsService = TestBed.inject(LiferantsService);
    dialogRef = TestBed.inject(MatDialogRef);
    error = TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data', fakeAsync( () => {
    const data: iLieferant = {
      id: 1,
      name: 'Test Lieferant',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678'
    };
    jest.spyOn(liferantsService, 'getLieferantById').mockReturnValue(of(data));
    component.data = data;
    component.ngOnInit();
    component.actt$.subscribe(() => {});
    tick();
    fixture.detectChanges();
    expect(component.lieferantForm.value).toEqual(data);
  }));

  it('should call liferantsService.createLieferant when form is valid and data is not provided', fakeAsync( () => {
    const item: iLieferant = {
      name: 'Test Lieferant',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678',
      id: undefined
    }
    const spy = jest.spyOn(liferantsService, 'createLieferant').mockReturnValue(of( item ));



    component.lieferantForm.patchValue(item);
    fixture.detectChanges();
    component.saveLieferant();
    component.actt$.subscribe(() => {})
    fixture.detectChanges();
    tick();


    expect(spy).toHaveBeenCalled();
  }));

  it('should call liferantsService.updateLieferant when form is valid and data is provided', () => {
    const data: iLieferant = {
      id: 1,
      name: 'Test Lieferant',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678'
    };
    const spy = jest.spyOn(liferantsService, 'updateLieferant').mockReturnValue(of(data));


    component.data = data;
    component.lieferantForm.setValue({
      id: 1,
      name: 'Test Lieferant Updated',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678'
    });
    component.saveLieferant();

    expect(spy).toHaveBeenCalled();
  });

  it('should call dialogRef.close when form is valid and saveLieferant is called', fakeAsync( () => {
    const spy = jest.spyOn(dialogRef, 'close');

    const data: iLieferant = {
      id: 1,
      name: 'Test Lieferant',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678'
    };

    component.data = data;
    component.lieferantForm.setValue({
      id: 1,
      name: 'Test Lieferant Updated',
      email: 'test@test.com',
      telefon: '123456789',
      adresse: {
        strasse: 'Test Straße',
        hausnummer: '1',
        stadt: 'Test Stadt',
        postleitzahl: '12345',
        land: 'Test Land'
      },
      steuernummer: '123456',
      bankkontonummer: '1234567890',
      ansprechpartner: 'Test Ansprechpartner',
      zahlart: 'Test Zahlart',
      umsatzsteuerIdentifikationsnummer: '12345678'
    });
    jest.spyOn(liferantsService, 'updateLieferant').mockReturnValue(of(data));
    fixture.detectChanges();
    component.saveLieferant();
    component.actt$.subscribe(() => {})
    fixture.detectChanges();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should call dialogRef.close when closeDialog is called', () => {
    const spy = jest.spyOn(dialogRef, 'close');

    component.closeDialog();

    expect(spy).toHaveBeenCalled();
  });
});
