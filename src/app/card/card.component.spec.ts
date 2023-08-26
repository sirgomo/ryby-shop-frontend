import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { HelperService } from '../helper/helper.service';
import { CompanyService } from '../admin/company/company.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { iProduct } from '../model/iProduct';
import { iColor } from '../model/iColor';
import { iLieferant } from '../model/iLieferant';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { iCompany } from '../model/iCompany';
import { Component } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let helperService: HelperService;
  let companyService: CompanyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent, FakeShippingAddressComponent],
      imports: [HttpClientTestingModule, MatTableModule, MatProgressSpinnerModule],
      providers: [{ provide: HelperService, useValue: {
        cardSig: jest.fn(() => [] as iProduct[]),
      }}, CompanyService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    helperService = TestBed.inject(HelperService);
    companyService = TestBed.inject(CompanyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', fakeAsync( () => {
    jest.spyOn(helperService, 'cardSig').mockReturnValue([]);
    jest.spyOn(companyService, 'getCompanyById').mockReturnValue(of({ isKleinUnternehmen: 1 } as iCompany));

    component.ngOnInit();
    component.act$.subscribe();
    tick();
    fixture.detectChanges();
    expect(component.colors).toEqual([]);
    expect(component.company.isKleinUnternehmen).toBe(1);
    expect(component.columns).toEqual(['artid', 'name', 'color', 'toTmenge', 'priceSt', 'totalPrice', 'remove']);
  }));

  it('should reload colors', () => {
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedColors: iColor[][] = [
      [{ id: '1', menge: 5 }],
      [{ id: '2', menge: 10 }]
    ];

    component.ngOnInit();

    expect(component.colors).toEqual(expectedColors);
  });

  it('should increase quantity', () => {
    const itemIndex = 0;
    const colorIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedColors: iColor[][] = [
      [{ id: '1', menge: 6 }]
    ];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    component.increaseQuantity(itemIndex, colorIndex);

    expect(component.colors).toEqual(expectedColors);
    expect(products[itemIndex].color).toBe('[{"id":"1","menge":6}]');
  });

  it('should decrease quantity', () => {
    const itemIndex = 0;
    const colorIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedColors: iColor[][] = [[]];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    component.decreaseQuantity(itemIndex, colorIndex);

    expect(component.colors).toEqual(expectedColors);
    expect(products[itemIndex].color).toBe('[]');
  });

  it('should remove item', fakeAsync( () => {
    const itemIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedProducts: iProduct[] = [];
    const expectedColors: iColor[][] = [];


    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    component.ngOnInit();
    component.act$.subscribe();
    tick();
    fixture.detectChanges();
    component.removeItem(itemIndex);


    expect(component.products()).toEqual(expectedProducts);
    expect(component.colors).toEqual(expectedColors);
  }));

  it('should calculate total price', () => {
    const itemIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedTotalPrice = ['50.00', '200.00'];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const totalPrice1 = component.getTotalPrice(0);
    const totalPrice2 = component.getTotalPrice(1);

    expect(totalPrice1).toBe(expectedTotalPrice[0]);
    expect(totalPrice2).toBe(expectedTotalPrice[1]);
  });

  it('should calculate price per unit', () => {
    const itemIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedPricePerSt = [10, 20];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const pricePerSt1 = component.getPricePerSt(0);
    const pricePerSt2 = component.getPricePerSt(1);

    expect(pricePerSt1).toBe(expectedPricePerSt[0]);
    expect(pricePerSt2).toBe(expectedPricePerSt[1]);
  });

  it('should calculate product Mwst', () => {
    const itemIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 20, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 15, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedProductMwst = ['2.00', '3.00'];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const productMwst1 = component.getProduktMwst(0);
    const productMwst2 = component.getProduktMwst(1);

    expect(productMwst1).toBe(expectedProductMwst[0]);
    expect(productMwst2).toBe(expectedProductMwst[1]);
  });

  it('should calculate product menge', () => {
    const itemIndex = 0;
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedProductMenge = [5, 10];

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const productMenge1 = component.getProductMenge(0);
    const productMenge2 = component.getProductMenge(1);

    expect(productMenge1).toBe(expectedProductMenge[0]);
    expect(productMenge2).toBe(expectedProductMenge[1]);
  });

  it('should calculate total count', fakeAsync( () => {
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedTotalCount = 15;

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);
    component.ngOnInit();
    component.act$.subscribe();
    tick();
    fixture.detectChanges();
    const totalCount = component.getTotalCount();

    expect(totalCount).toBe(expectedTotalCount);
  }));

  it('should calculate total price netto', () => {
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 0, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedTotalPriceNetto = '250.00';

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const totalPriceNetto = component.getTotalPriceNetto();

    expect(totalPriceNetto).toBe(expectedTotalPriceNetto);
  });

  it('should calculate total Mwst', () => {
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 20, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 15, promocje: [], reservation: [], bewertung: [] }
    ];
    const expectedTotalMwst = '40.00';

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const totalMwst = component.getTotalMwst();

    expect(totalMwst).toBe(expectedTotalMwst);
  });

  it('should calculate total brutto', () => {
    const products: iProduct[] = [
      { id: 1, name: 'Product 1', preis: 10, artid: 1, beschreibung: 'Description 1', color: '[{"id": "1", "menge": 5}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 5, product_sup_id: '', lange: 1, gewicht: 1, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 20, promocje: [], reservation: [], bewertung: [] },
      { id: 2, name: 'Product 2', preis: 20, artid: 2, beschreibung: 'Description 2', color: '[{"id": "2", "menge": 10}]', foto: '', thumbnail: '', lieferant: {} as iLieferant, lagerorte: [], bestellungen: [], datumHinzugefuegt: '', kategorie: [], verfgbarkeit: true, mindestmenge: 1, currentmenge: 10, product_sup_id: '', lange: 2, gewicht: 2, verkaufteAnzahl: 0, wareneingang: [], warenausgang: [], mehrwehrsteuer: 15, promocje: [], reservation: [], bewertung: [] }
    ];

    const expectedTotalBrutto = '290.00';

    jest.spyOn(helperService, 'cardSig').mockReturnValue(products);

    const totalBrutto = component.getTotalBrutto();

    expect(totalBrutto).toBe(expectedTotalBrutto);
  });
});

@Component({
  selector: 'app-shipping-address',
  template: ''
})
class FakeShippingAddressComponent {

}
