import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { HelperService } from '../helper/helper.service';
import { CompanyService } from '../admin/company/company.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iProduct } from '../model/iProduct';
import { iLieferant } from '../model/iLieferant';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { iProduktVariations } from '../model/iProduktVariations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ShippingAddressComponent } from './shipping-address-make-bestellung/shipping-address.component';
import { JwtModule } from '@auth0/angular-jwt';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { iCompany } from '../model/iCompany';
import { IShippingCost } from '../model/iShippingCost';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let helperService: HelperService;
  let testController: HttpTestingController;

  const products: iProduct[] = [];
  let vari: iProduktVariations = {} as iProduktVariations;
  const shippingCost:IShippingCost = {
    shipping_price: 5,
    shipping_name: 'Standard',
    cost_per_added_stuck: 1,
    average_material_price: 0
  };
  const prod: iProduct = {
    id: 1,
    name: 'jdkashdkjas',
    sku: 'asd',
    artid: 23,
    beschreibung: 'jkahd asjkdh ajksh  jkas',
    lieferant: { id: 1} as iLieferant,
    lagerorte: [],
    bestellungen: [],
    datumHinzugefuegt: '2022-01-10',
    kategorie: [],
    verfgbarkeit: 1,
    product_sup_id: '',
    ebay: 0,
    wareneingang: [],
    mehrwehrsteuer: 0,
    promocje: [],
    bewertung: [],
    eans: [],
    variations: [vari],
    produkt_image: '',
    shipping_costs: [shippingCost]
  };
  const company: iCompany = {
    name: 'jhasdhajksd',
    company_name: 'jkadjkas',
    address: 'kjsdhajskdh',
    city: '',
    postleitzahl: '',
    country: '',
    phone: '',
    email: '',
    isKleinUnternehmen: 1,
    ustNr: '',
    fax: '',
    eu_komm_hinweis: '',
    agb: '',
    daten_schutzt: '',
    cookie_info: '',
    is_in_urlop: false
  };
  products.push(prod);
  beforeEach(async () => {
    vari  = {
      sku: 'sadkajdsjaks',
      produkt: { id :1 },
      variations_name: 'sjdhas',
      hint: '',
      value: 'toto',
      unit: '',
      image: '',
      price: 5,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 10,
      quanity_sold: 1,
      quanity_sold_at_once: 1,
    };
    prod.variations = [vari];
    await TestBed.configureTestingModule({

      imports: [CardComponent ,HttpClientTestingModule, MatProgressSpinnerModule, ShippingAddressComponent,
         MatSelectModule, MatTableModule, MatIconModule, CommonModule, MatButtonModule, NoopAnimationsModule, JwtModule.forRoot({ config: { tokenGetter: jest.fn(), }})],
      providers: [
        CompanyService,
        HelperService,
      ]
    })
      .compileComponents();
      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      helperService = TestBed.inject(HelperService);
      testController = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    initRequ();
    expect(component).toBeTruthy();
  });
  it('should display the correct total quantity', () => {
    component.products.set([...products]);
    initRequ();
    fixture.detectChanges();
    const totalCountElement = fixture.nativeElement.querySelector('#totmenge');
    expect(totalCountElement.textContent).toContain(`Total Menge: ${component.getTotalCount()}`);
  });

  it('should increase product quantity', () => {
    component.products.set([...products]);
    initRequ();
    const initialQuantity = component.products()[0].variations[0].quanity;
    component.increaseQuantity(0);
    expect(component.products()[0].variations[0].quanity).toBe(initialQuantity + 1);
  });

  it('should decrease product quantity', () => {
    component.products.set([...products]);
    initRequ();
    const initialQuantity = component.products()[0].variations[0].quanity;
    component.decreaseQuantity(0);
    expect(component.products()[0].variations[0].quanity).toBe(initialQuantity - 1);
  });

  it('should remove an item from the cart', () => {
    component.products.set([...products]);
    initRequ();
    const initialLength = component.products().length;
    component.removeItem(0);
    expect(component.products().length).toBe(initialLength - 1);
  });

  it('should calculate total price correctly', () => {
    component.products.set([...products]);
    initRequ();
    const totalPrice = component.getTotalPrice(0);
    expect(totalPrice).toBe((products[0].variations[0].quanity * products[0].variations[0].price).toFixed(2));
  });

  it('should set shipping cost on selection', () => {
    component.products.set([...products]);
    initRequ();
  });

  it('should display the correct total price with shipping', () => {
    component.products.set([...products]);
    initRequ();
  });

  it('should check if there is enough product to increase quantity', () => {
    component.products.set([...products]);
    initRequ();
    const item: iProduct = {
      ...prod,
    };
    item.variations = [
      {
        ...vari,
        quanity: 100,
      }
    ];

    component.helper.cardSigForMengeControl.set([item]);
    fixture.detectChanges();
    const isEnough = component.doWeHaveEnough(0);
    expect(isEnough).toBe(true);
  });

  it('should not allow to increase quantity if not enough product', () => {
    component.products.set([...products]);
    initRequ();
    const product = component.products()[0];
    product.variations[0].quanity = product.variations[0].quanity_sold + 1;
    fixture.detectChanges();
    const isEnough = component.doWeHaveEnough(0);
    expect(isEnough).toBe(false);
  });

  it('should get the correct total count of products', () => {
    component.products.set([...products]);
    initRequ();
    const totalCount = component.getTotalCount();
    expect(totalCount).toBe(products.reduce((acc, product) => acc + product.variations[0].quanity, 0));
  });

  it('should get the correct total price netto', () => {
    company.isKleinUnternehmen = 0;
    component.products.set([...products]);
    initRequ();
    const prNett = component.getTotalPriceNetto();
    fixture.detectChanges();
    expect(prNett).toBe('50.00')
  });

  it('should get the correct total MwSt', () => {
    component.products.set([...products]);
    initRequ();
    const totalMwSt = component.getTotalMwst();
    expect(totalMwSt).toBe('0.00');
  });

  it('should get the correct total price brutto', () => {
    component.products.set([...products]);
    initRequ();
    const bruttoPrice = component.getTotalBrutto();
    const expectedBrutto = (Number(component.getTotalPriceNetto()) + Number(component.getTotalMwst())).toFixed(2);
    expect(bruttoPrice).toBe(expectedBrutto);
  });
  function initRequ() {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api+'company/1');
    expect(requ.request.method).toBe('GET');
    requ.flush(company);
  }
});


