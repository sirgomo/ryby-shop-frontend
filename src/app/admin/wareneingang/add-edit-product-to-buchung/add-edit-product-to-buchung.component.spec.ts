import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEditProductToBuchungComponent } from './add-edit-product-to-buchung.component';
import { WareneingangService } from '../wareneingang.service';
import { ErrorService } from 'src/app/error/error.service';
import { Observable, of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddEditBuchungComponent } from '../add-edit-buchung/add-edit-buchung.component';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { iLieferant } from 'src/app/model/iLieferant';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { iProduct } from 'src/app/model/iProduct';

describe('AddEditProductToBuchungComponent', () => {
  let component: AddEditProductToBuchungComponent;
  let fixture: ComponentFixture<AddEditProductToBuchungComponent>;
  let mockDialogRef: Partial<MatDialogRef<AddEditProductToBuchungComponent>>;
  let mockData: any;
  let mockFormBuilder: FormBuilder;
  let wEingService: WareneingangService;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync( () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    mockData = {
      id: 1,
      produkt: [
        {
          id: 1,
          name: 'Product 1',
          color: '[{"id": "color1", "menge": 5}, {"id": "color2", "menge": 10}]',
        },
      ],
      menge: 15,
      color: '[{"id": "color1", "menge": 5}, {"id": "color2", "menge": 10}]',
    };
    mockFormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [AddEditProductToBuchungComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MatInputModule,MatFormFieldModule, HttpClientTestingModule],
      providers: [
         WareneingangService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: ErrorService, useValue: {} },
        { provide: MatSnackBar, useValue: {
          open: jest.fn(),
        } },
      ],
    }).compileComponents()
    .then(() => {
    fixture = TestBed.createComponent(AddEditProductToBuchungComponent);
    wEingService = TestBed.inject(WareneingangService);
    snackBar = TestBed.inject(MatSnackBar);
    component = fixture.componentInstance;
    const warenEin: iWarenEingang = {
      id: 1,
      products: [],
      lieferant: {} as iLieferant,
      empfangsdatum: '',
      rechnung: '',
      lieferscheinNr: '',
      datenEingabe: '',
      gebucht: false,
      eingelagert: false
    };

    const addEdit = { data: warenEin } as AddEditBuchungComponent;
    wEingService.currentWarenEingangSig.set(addEdit);
    component.wareneingang = addEdit;
  })}));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly when data is provided', () => {
    component.wEingangProduct.get('id')?.setValue(null);
    expect(component.wEingangProduct).toBeDefined();
    expect(component.wEingangProduct.get('id')).toBeDefined();
    expect(component.wEingangProduct.get('produkt')).toBeDefined();
    expect(component.wEingangProduct.get('menge')).toBeDefined();
    expect(component.wEingangProduct.get('preis')).toBeDefined();
    expect(component.wEingangProduct.get('mwst')).toBeDefined();
    expect(component.wEingangProduct.get('mengeEingelagert')).toBeDefined();
    expect(component.wEingangProduct.get('color')).toBeDefined();

    expect(component.wEingangProduct.get('id')?.value).toBeNull();
    expect(component.wEingangProduct.get('produkt')?.value).toBe('Product 1');
    expect(component.wEingangProduct.get('menge')?.value).toBe(15);
    expect(component.wEingangProduct.get('preis')?.value).toBe(0);
    expect(component.wEingangProduct.get('mwst')?.value).toBe(0);
    expect(component.wEingangProduct.get('mengeEingelagert')?.value).toBe(0);
    expect(component.wEingangProduct.get('color')).toBeInstanceOf(FormArray);
   // expect(component.wEingangProduct.get('color')?.length).toBe(2);
  });

  it('should initialize the form correctly when data is not provided', () => {

    TestBed.resetTestingModule(); // Reset the TestBed component

    TestBed.configureTestingModule({
      declarations: [AddEditProductToBuchungComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MatInputModule, MatFormFieldModule, HttpClientTestingModule],
      providers: [
        WareneingangService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: ErrorService, useValue: {} },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents()
    .then(() => {

      fixture = TestBed.createComponent(AddEditProductToBuchungComponent);
      wEingService = TestBed.inject(WareneingangService);
      snackBar = TestBed.inject(MatSnackBar);
      component = fixture.componentInstance;

      expect(component.wEingangProduct.get('produkt')?.value).toBeNull();
    expect(component.wEingangProduct.get('menge')?.value).toBe(0);
    expect(component.wEingangProduct.get('preis')?.value).toBe(0);
    expect(component.wEingangProduct.get('mwst')?.value).toBe(0);
    expect(component.wEingangProduct.get('mengeEingelagert')?.value).toBe(0);
    expect(component.wEingangProduct.get('color')).toBeInstanceOf(FormArray);

    });



  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should return the color form array', () => {
    const colorFormArray = component.getColor();
    expect(colorFormArray).toBeInstanceOf(FormArray);
    expect(colorFormArray.length).toBe(2);
  });

  it('should create a color form', () => {
    const colorForm = component.colorForm();
    expect(colorForm).toBeInstanceOf(FormGroup);
    expect(colorForm.get('id')).toBeDefined();
    expect(colorForm.get('menge')).toBeDefined();
    expect(colorForm.get('id')?.value).toBe('');
    expect(colorForm.get('menge')?.value).toBe(0);
  });

  it('should return the item as a form group', () => {
    const item = component.getColor().at(0);
    const itemFormGroup = component.getItem(item);
    expect(itemFormGroup).toBeInstanceOf(FormGroup);
    expect(itemFormGroup.get('id')).toBeDefined();
    expect(itemFormGroup.get('menge')).toBeDefined();
    expect(itemFormGroup.get('id')?.value).toBe('color1');
    expect(itemFormGroup.get('menge')?.value).toBe(5);
  });

  it('should update the total quantity when onChangeFarbeMenge() is called', () => {
    component.onChangeFarbeMenge();
    expect(component.wEingangProduct.get('menge')?.value).toBe(15);
  });

  it('should not save the product and display a snackbar message when the form is invalid', () => {

    const snackbarSpy = jest.spyOn(snackBar, 'open').mockImplementation();

    component.save();
    expect(snackbarSpy).toHaveBeenCalledWith('Etwas stimmit nicht', 'Ok', { duration: 2000 });
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should save the product and close the dialog when the form is valid and data is provided', () => {
    component.data.id = undefined;
    const snackbarSpy = jest.spyOn(snackBar, 'open').mockImplementation();
    const addProductToWarenEingangSpy = jest.spyOn(wEingService, 'addProductToWarenEingang').mockReturnValue(
      of({ id: 1} as iWareneingangProduct)
    );

    component.wEingangProduct.get('menge')?.setValue(5);
    component.wEingangProduct.get('preis')?.setValue(10);

    component.save();
    component.act$.subscribe()
    expect(snackbarSpy).toHaveBeenCalledWith('Gespichert', 'Ok', { duration: 1500 });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(addProductToWarenEingangSpy).toHaveBeenCalled();
  });

  it('should save the product and close the dialog when the form is valid and data is not provided', () => {
    component.data.id = undefined;


    const snackbarSpy = jest.spyOn(snackBar, 'open').mockImplementation();
    const addProductToWarenEingangSpy = jest.spyOn(wEingService, 'addProductToWarenEingang').mockReturnValue(of({ id: 1} as iWareneingangProduct))

    component.wEingangProduct.get('produkt')?.setValue('Product 1');
    component.wEingangProduct.get('menge')?.setValue(5);
    component.wEingangProduct.get('preis')?.setValue(10);
    fixture.detectChanges();
    component.save();
    component.act$.subscribe();
    expect(addProductToWarenEingangSpy).toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith('Gespichert', 'Ok', { duration: 1500 });
    expect(mockDialogRef.close).toHaveBeenCalled();

  });
});
