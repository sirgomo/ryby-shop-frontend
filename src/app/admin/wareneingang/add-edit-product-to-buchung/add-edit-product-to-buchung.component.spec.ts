import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEditProductToBuchungComponent } from './add-edit-product-to-buchung.component';
import { WareneingangService } from '../wareneingang.service';
import { ErrorService } from 'src/app/error/error.service';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddEditBuchungComponent } from '../add-edit-buchung/add-edit-buchung.component';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { iLieferant } from 'src/app/model/iLieferant';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { iProduct } from 'src/app/model/iProduct';
import { iLager } from 'src/app/model/iLager';
import { iProduktVariations } from 'src/app/model/iProduktVariations';


describe('AddEditProductToBuchungComponent', () => {
  let component: AddEditProductToBuchungComponent;
  let fixture: ComponentFixture<AddEditProductToBuchungComponent>;
  let mockDialogRef: Partial<MatDialogRef<AddEditProductToBuchungComponent>>;
  let mockData: iWareneingangProduct;
  let mockFormBuilder: FormBuilder;
  let wEingService: WareneingangService;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync( () => {
    mockDialogRef = {
      close: jest.fn(),
    };
    const vari: iProduktVariations = {
      sku: 'adasd',
      quanity: 2,
      price: 2.2,
      wholesale_price: 0,
      quanity_sold_at_once: 1,
      produkt: { id: 1},
      variations_name: '',
      hint: '',
      value: 'asdasd',
      unit: '',
      image: '',
      thumbnail: '',
      quanity_sold: 1,
    };
    const vari2: iProduktVariations = {
      sku: 'adasasdsd',
      quanity: 22,
      price: 2.5,
      wholesale_price: 0,
      quanity_sold_at_once: 1,
      produkt: { id: 1},
      variations_name: 'asjhdash',
      hint: '',
      value: 'ksjdakjsd',
      unit: '',
      image: '',
      thumbnail: '',
      quanity_sold: 0
    };
    const prod: iProduct = {
      id: 1,
      name: 'iasudajsda',
      sku: 'jkasasdjkhajksd',
      artid: 0,
      beschreibung: 'ajshdghjasd',
      lieferant: {} as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '',
      kategorie: [],
      verfgbarkeit: 0,
      product_sup_id: '',
      ebay: 0,
      wareneingang: [],
      mehrwehrsteuer: 0,
      promocje: [],
      bewertung: [],
      eans: [],
      variations: [vari, vari2],
      produkt_image: '',
      shipping_costs: []
    };
    mockData = {
      id: 1,
      wareneingang: null,
      produkt: [prod],
      product_variation: [
        {
          sku: 'adasd',
          quanity: 2,
          price: 2.2,
          price_in_euro: 1.5,
          wholesale_price: 0,
          mwst: 0,
          quanity_stored: 1,
          quanity_sold_at_once: 1,
          waren_eingang_product: {} as iWareneingangProduct
        },
        {
          sku: 'adasasdsd',
          quanity: 22,
          price: 2.5,
          price_in_euro: 2,
          wholesale_price: 0,
          mwst: 0,
          quanity_stored: 1,
          quanity_sold_at_once: 1,
          waren_eingang_product: {} as iWareneingangProduct
        }
      ]
    };
    mockFormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      imports: [AddEditProductToBuchungComponent, ReactiveFormsModule, BrowserAnimationsModule, MatInputModule,MatFormFieldModule, HttpClientTestingModule],
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
      eingelagert: false,
      shipping_cost: 0,
      remarks: '',
      other_cost: 0,
      location: {} as iLager,
      wahrung: '',
      wahrung2: '',
      wahrung_rate: 0,
      shipping_cost_eur: 0,
      other_cost_eur: 0
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
    expect(component.product_variation.at(0).get('quanity')).toBeDefined();


    expect(component.wEingangProduct.get('id')?.value).toBeNull();
    expect(component.wEingangProduct.get('produkt')?.value).toBe('iasudajsda');
    expect(component.product_variation.at(0).get('quanity')?.value).toBe(2);

    expect(component.product_variation.at(0).get('quanity_stored')?.value).toBe(1);
    expect(component.wEingangProduct.get('product_variation')).toBeInstanceOf(FormArray);
   // expect(component.wEingangProduct.get('color')?.length).toBe(2);
  });

  it('should initialize the form correctly when data is not provided', () => {

    TestBed.resetTestingModule(); // Reset the TestBed component

    TestBed.configureTestingModule({
      imports: [AddEditProductToBuchungComponent, ReactiveFormsModule, BrowserAnimationsModule, MatInputModule, MatFormFieldModule, HttpClientTestingModule],
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


  it('should not save the product and display a snackbar message when the form is invalid', () => {

    const snackbarSpy = jest.spyOn(snackBar, 'open').mockImplementation();
    mockData.produkt[0].id = undefined;
    fixture.detectChanges();
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
