import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemDetailsComponent } from './item-details.component';
import { HelperService } from 'src/app/helper/helper.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { JwtModule } from '@auth0/angular-jwt';
import { iKategorie } from 'src/app/model/iKategorie';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/admin/product/product.service';
import { environment } from 'src/environments/environment';
import { iProduktVariations } from 'src/app/model/iProduktVariations';


describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;
  let helperService: HelperService;
  let snackBar: MatSnackBar;
  let testController : HttpTestingController;

  let vari:iProduktVariations = {
    sku: 'djashdk',
    produkt: { id: 1},
    variations_name: 'jkasdahsd',
    hint: '',
    value: 'kjash',
    unit: 'asd',
    image: '',
    price: 3.55,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 50,
    quanity_sold: 1,
    quanity_sold_at_once: 1,
  };


  const prod: iProduct = {
    id: 1,
    name: 'Test Item',
    artid: 1,
    lieferant: { id: 1, name: 'Test Supplier' } as iLieferant,
    lagerorte: [{ id: 1, name: 'Test Storage' }],
    bestellungen: [],
    datumHinzugefuegt: '2022-01-01',
    kategorie: [{ id: 1, name: 'Test Category' } as iKategorie],
    verfgbarkeit: 1,
    product_sup_id: '12345',
    wareneingang: [],
    mehrwehrsteuer: 20,
    promocje: [],
    bewertung: [],
    sku: '',
    beschreibung: '',
    ebay: 0,
    eans: [],
    variations: [vari],
    produkt_image: '',
    shipping_costs: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ItemDetailsComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCheckboxModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: jest.fn(),
          }
        }),
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        FormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: prod },
        { provide: MatSnackBar, useValue: {
          open: jest.fn(),
        }},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn(() => prod.id),
              }
            }
          }
        },
        ProductService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    helperService = TestBed.inject(HelperService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create the component', () => {
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    expect(component).toBeTruthy();
  });

  it('should set the title', () => {
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    expect(helperService.titelSig()).toBe(environment.site_title + ' - '+prod.name);
  });
  it('should call get image with variations image link', () => {
    jest.spyOn(component, 'getImage');
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'variation/uploads/');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(new Blob([''], { }));
    fixture.detectChanges();

    expect(component.getImage).toHaveBeenCalledTimes(1);
    expect(component.getImage).toHaveBeenCalledWith(prod.variations[0].image);
  });
  it('should get the product details and set current varations to first element in produkt.variations table', () => {
    jest.spyOn(component, 'getItemQuanity');
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'variation/uploads/');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(new Blob([''], { }));
    fixture.detectChanges();
    expect(component.currentVariation).toEqual(prod.variations[0]);
  });

  it('should check current quantity',  () => {
    jest.spyOn(component, 'getItemQuanity');
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'variation/uploads/');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(new Blob([''], { }));
    fixture.detectChanges();
    component.currentItemQuanity = 2;
    const additemBut = fixture.nativeElement.querySelector('#additem');
    additemBut.click();
    fixture.detectChanges();
    expect(component.getItemQuanity).toHaveBeenCalled();
    expect(component.getItemQuanity).toHaveLastReturnedWith(48);

  });

  it('should add the item to the cart', () => {
    jest.spyOn(component, 'addItem');
    const requ = testController.expectOne(environment.api+'product/'+prod.id);
    expect(requ.request.method).toBe('GET');
    requ.flush(prod);
    fixture.detectChanges();
    const requ2 = testController.expectOne(environment.api+'variation/uploads/');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(new Blob([''], { }));
    fixture.detectChanges();
    component.currentItemQuanity = 1;
    const additemBut = fixture.nativeElement.querySelector('#additem');
    additemBut.click();
    fixture.detectChanges();
    expect( helperService.cardSig().length).toBe(1);
    const tmpItem= {} as iProduct;
    Object.assign(tmpItem, prod);
    tmpItem.variations[0].quanity = 1;
    expect(helperService.cardSig()[0]).toEqual(tmpItem);
    expect(component.addItem).toHaveBeenCalledTimes(1);
  });
});
