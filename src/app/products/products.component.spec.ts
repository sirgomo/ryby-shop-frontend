import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductService } from '../admin/product/product.service';
import { iProduct } from '../model/iProduct';
import { iLieferant } from '../model/iLieferant';
import { Component, Input, Signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemComponent } from './item/item.component';

describe('ProductComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: Partial<ProductService>;

  beforeEach(() => {

    const tmpItem: iProduct = {
      id: 1,
      name: 'kawa',
      preis: 0,
      artid: 0,
      beschreibung: '',
      color: '',
      foto: '',
      thumbnail: '',
      lieferant: {} as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '',
      kategorie: [],
      verfgbarkeit: false,
      mindestmenge: 0,
      currentmenge: 0,
      product_sup_id: '',
      lange: 0,
      gewicht: 0,
      verkaufteAnzahl: 0,
      wareneingang: [],
      warenausgang: [],
      mehrwehrsteuer: 0,
      promocje: [],
      bewertung: []
    };
    productService = {
        productsSig: jest.fn().mockReturnValue([tmpItem]) as unknown as Signal<iProduct[]>,

    }
    TestBed.configureTestingModule({
      declarations: [ProductsComponent, FakeAppItemComponent],
      providers: [{ provide: ProductService, useValue: productService }],
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load products', () => {
    const productElements = fixture.debugElement.queryAll(By.css('.product-list app-item'));
    expect(productElements.length).toBe(1);
  });
});
@Component({selector: 'app-item', template: ''})
class FakeAppItemComponent {
  @Input() item!: iProduct;
}

TestBed.configureTestingModule({
  declarations: [ProductsComponent, FakeAppItemComponent],
  providers: [{ provide: ProductService, useValue: ProductService }],
});
