import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditProductComponent } from './add-edit-product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { iKategorie } from 'src/app/model/iKategorie';
import { IShippingCost } from 'src/app/model/iShippingCost';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { iEan } from 'src/app/model/iEan';


describe('AddEditProductComponent', () => {
  let component: AddEditProductComponent;
  let fixture: ComponentFixture<AddEditProductComponent>;
  let testController: HttpTestingController;
  let prod: iProduct;
  let liferants: iLieferant[];
  let kategories: iKategorie[];
  let shipping: IShippingCost[];

  beforeEach(async () => {
    setTestData();
    await TestBed.configureTestingModule({
      imports: [AddEditProductComponent, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatMomentDateModule,
        MatCheckboxModule, NoopAnimationsModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, HttpClientTestingModule, JwtModule.forRoot( {
          config: {
            tokenGetter: jest.fn(),
          }
        })],
      providers: [
        { provide: MatDialogRef, useValue: {
          close: jest.fn(),
        } },
        { provide: MAT_DIALOG_DATA, useValue: prod },
        { provide: FormBuilder, useClass: FormBuilder },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddEditProductComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    (globalThis as any).URL.createObjectURL = jest.fn(() => 'mocked-blob-url');
  });
  afterEach(() => {
    jest.restoreAllMocks();
    testController.verify();
  })

  it('should create the component', () => {
       fixture.detectChanges();
        getInitRequest();

        expect(component).toBeTruthy();
  });

  it('should patch form values with data if provided', () => {
    fixture.detectChanges();
    getInitRequest();
    expect(component.productForm.value).toEqual({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      artid: prod.artid,
      beschreibung: prod.beschreibung,
      lieferant: prod.lieferant,
      lagerorte: prod.lagerorte,
      bestellungen: prod.bestellungen,
      datumHinzugefuegt: prod.datumHinzugefuegt,
      kategorie: prod.kategorie,
      //disabled !
     // verfgbarkeit: prod.verfgbarkeit,
      product_sup_id: prod.product_sup_id,
      wareneingang: prod.wareneingang,
      mehrwehrsteuer: prod.mehrwehrsteuer,
      promocje: prod.promocje,
      bewertung: prod.bewertung,
      eans: prod.eans,
      produkt_image: prod.produkt_image,
      shipping_costs: prod.shipping_costs,
    });
  });

  it('should add an EAN when addEan is called', () => {
    fixture.detectChanges();
    getInitRequest();
    component.addEan();
    expect(component.ean.length).toBe(2);
  });

  it('should remove an EAN when removeEan is called', () => {
    fixture.detectChanges();
    getInitRequest();
    component.addEan();
    expect(component.ean.length).toBe(2);
    component.removeEan(1);
    expect(component.ean.length).toBe(1);
  });

  it('should call ProductService to save product when saveProduct is called with valid form', () => {
    fixture.detectChanges();
    jest.spyOn(component, 'saveProduct');
    getInitRequest();
    fixture.detectChanges();
    const saveBut = fixture.nativeElement.querySelector('#saveP');
    saveBut.click();
    fixture.detectChanges();
    expect(component.saveProduct).toHaveBeenCalled();
    expect(component.productForm.valid).toBeTruthy();
    expect(component.data).toEqual({...component.productForm.value, ebay: 0,  variations: [], verfgbarkeit: 0
    });

    const putRequ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(putRequ.request.method).toBe('PUT');
    putRequ.flush({id: 1});

  });

  it('should show snackbar  when saveProduct is called with invalid form', () => {
    jest.spyOn(component.snackBar, 'open');
    fixture.detectChanges();
    getInitRequest();
    component.productForm.patchValue({ name: '' });
    fixture.detectChanges();
    const saveBut = fixture.nativeElement.querySelector('#saveP');
    saveBut.click();
    fixture.detectChanges();
    expect(component.productForm.valid).toBeFalsy();
    expect(component.snackBar.open).toHaveBeenCalledWith('Das Artikel Formular ist fehlerhaft ausgefüllt.', 'OK', { duration: 2000 });
  });

  it('should close the dialog when cancel is called', () => {

    fixture.detectChanges();
    getInitRequest();
    const closeSpy = jest.spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(closeSpy).toHaveBeenCalled();
  });



  it('should get image when getImage is called', () => {
    prod.produkt_image = 'aksjdlkajd';
    jest.spyOn(component, 'getImage');
    jest.spyOn(component, 'getSafeImageData');

    fixture.detectChanges();
    getInitRequest();

    const requ = testController.expectOne(environment.api+'variation/uploads/');
    expect(requ.request.method).toBe('POST');
    requ.flush(new Blob([''], { type: 'image/jpeg' }));

    fixture.detectChanges;
    expect(component.currentImage).toEqual(new Blob([''], { type: 'image/jpeg' }));
    expect(component.getImage).toHaveBeenCalledWith('aksjdlkajd');
    expect(component.getImage).toHaveBeenCalledTimes(1);
    component.getSafeImageData();
    fixture.detectChanges;
    expect(component.getSafeImageData).toHaveBeenCalledTimes(1);
    expect(component.getSafeImageData).toHaveReturned();

  });

  it('should check if two objects are selected', () => {
    fixture.detectChanges();
    getInitRequest();

    const o1 = { id: 1 };
    const o2 = { id: 1 };
    const o3 = { id: 2 };
    expect(component.getSelected(o1, o2)).toBe(true);
    expect(component.getSelected(o1, o3)).toBe(false);
  });

  it('should generate a random SKU of predefined length', () => {
    fixture.detectChanges();
    getInitRequest();

    const sku = component.getRandomSku();
    expect(sku).toHaveLength(environment.minskulength*2);
    expect(sku).toMatch(/^[A-Za-z0-9\-_]+$/);
  });
  function getInitRequest() {
    const requ = testController.expectOne(environment.api+'liferant');
    expect(requ.request.method).toBe('GET');
    requ.flush(liferants);
    fixture.detectChanges();
    const requ1 = testController.expectOne(environment.api+'kategorie');
    expect(requ1.request.method).toBe('GET');
    requ1.flush(kategories);
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'shipping');
    expect(requ2.request.method).toBe('GET');
    requ2.flush(shipping);
    fixture.detectChanges();
    const requ3 = testController.expectOne(environment.api+'product/1');
    expect(requ3.request.method).toBe('GET');
    requ3.flush(prod);
    fixture.detectChanges();
  }
  function setTestData() {
    liferants = [];
    kategories = [];
    shipping = [];
    const lifer: iLieferant = {
      id: 1,
      name: 'asjkdhas',
      email: 'ajkshd',
      telefon: '123',
      adresse: {
        strasse: 'asdljkjalsjkhd',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    const lifer2: iLieferant = {
      id: 2,
      name: 'jldghasgdl jk',
      email: 'aslkjd jkasd',
      telefon: '',
      adresse: {
        strasse: '',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    liferants = [lifer, lifer2];
    const kat: iKategorie = {
      id: 1,
      parent_id: null,
      name: 'kjasdhjkasd',
      products: []
    };
    kategories = [kat];
    const shipp: IShippingCost = {
      shipping_name: 'DHL',
      shipping_price: 1,
      average_material_price: 0,
      cost_per_added_stuck: 0
    };
    shipping = [shipp];
    const ean:iEan = {
      id: 1,
      eanCode: 'sdkashdkashd'
    };
    prod = {
      id: 1,
      name: 'prod',
      sku: 'ajksd',
      artid: 1,
      beschreibung: 'kasjdhklakhd',
      lieferant: lifer,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '2022-01-01',
      kategorie: kategories,
      verfgbarkeit: 0,
      product_sup_id: '',
      ebay: 0,
      wareneingang: [],
      mehrwehrsteuer: 0,
      promocje: [],
      bewertung: [],
      eans: [ean],
      variations: [],
      produkt_image: '',
      shipping_costs: shipping,
    };
  }
});



