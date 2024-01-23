import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../admin/product/product.service';
import { iProduct } from '../model/iProduct';
import { iLieferant } from '../model/iLieferant';
import { By } from '@angular/platform-browser';
import { ItemComponent } from './item/item.component';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ProductsQuanitySelectorComponent } from './products-quanity-selector/products-quanity-selector.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

describe('ProductComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let testController: HttpTestingController;

  const tmpItem: iProduct = {
    id: 1,
    name: 'ajkshk jha kjhsd',
    sku: 'asnmd  ajsd ',
    artid: 0,
    beschreibung: 'askjd askjdh ash jkasdh',
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
    variations: [],
    produkt_image: '',
    shipping_costs: []
  };

  beforeEach(() => {


    TestBed.configureTestingModule({
      imports: [ItemComponent, CommonModule, ProductsQuanitySelectorComponent, PaginatorComponent, HttpClientTestingModule, NoopAnimationsModule, JwtModule.forRoot({
        config: {
          tokenGetter: jest.fn(),
        }
      })],
      providers: [
        ProductService
      ],
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);



  });
  afterEach(() => {
    testController.verify();
  })

  it('should create', () => {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api + 'product/kunde/null/0/10/1');
    expect(requ.request.method).toBe('GET');
    requ.flush([[tmpItem], 1]);
    expect(component).toBeTruthy();
  });
  it('should load products', () => {
    tmpItem.produkt_image = 'jkasdhasd';
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api + 'product/kunde/null/0/10/1');
    expect(requ.request.method).toBe('GET');
    requ.flush([[tmpItem], 1]);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.pitem'));
    expect(items.length).toBe(1);

    const requ2 = testController.expectOne(environment.api + 'variation/thumbnails/');
    expect(requ2.request.method).toBe('POST');
    requ2.flush(new Blob());
  });
});

