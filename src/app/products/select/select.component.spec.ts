import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { getSortedVariation } from '../functions';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let vari: iProduktVariations = {
    sku: 'sjahsdhashd',
    produkt: {id: 1},
    variations_name: 'dkahsd',
    hint: 'hagsd',
    value: 'asdjasd',
    unit: 'ajksdg',
    image: '',
    price: 2,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 5,
    quanity_sold: 0,
    quanity_sold_at_once: 0
  };
  let vari1: iProduktVariations = {
    sku: 'sjahsdhashdasd',
    produkt: {id: 1},
    variations_name: 'ashdglasjd j',
    hint: 'hagsd',
    value: 'asdjasd',
    unit: 'ajksdg',
    image: '',
    price: 2,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 5,
    quanity_sold: 0,
    quanity_sold_at_once: 0
  };
  let item: iProduct = {
    id: 1,
    name: 'khjdashdkj',
    sku: 'ajshd',
    artid: 0,
    beschreibung: 'öashd hasjkh a',
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
    variations: [vari, vari1],
    produkt_image: 'askljd',
    shipping_costs: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent]
    });
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit current variation on color change', () => {
    jest.spyOn(component.current, 'emit');
    component.sortedVarations =  getSortedVariation(item);
    fixture.detectChanges();

    const selectElement = fixture.nativeElement.querySelector('select');
    const mockEvent = { value: selectElement.value };
    selectElement.value = component.item.variations[1].sku;

    component.colorChange(mockEvent);
    fixture.detectChanges();

    expect(component.current.emit).toHaveBeenCalledWith(component.item.variations[0]);
  });

  it('should reset other selectors when one is changed', () => {
    component.sortedVarations = getSortedVariation(item);

    fixture.detectChanges();

    const selectElements = fixture.nativeElement.querySelectorAll('select');
    selectElements[0].value = component.item.variations[0].sku;
    selectElements[1].value = component.item.variations[1].sku;

    const mockEvent = { target: selectElements[0] };
    component.colorChange(mockEvent);
    fixture.detectChanges();

    expect(selectElements[1].value).toBe('---');
  });

  it('should not reset the selector that triggered the change', () => {
    component.sortedVarations =  getSortedVariation(item);

    fixture.detectChanges();

    const selectElements = fixture.nativeElement.querySelectorAll('option');
    selectElements[0].value = component.item.variations[0].sku;

    const mockEvent = { target: selectElements[0] };
    component.colorChange(mockEvent);
    fixture.detectChanges();

    expect(selectElements[0].value).toBe(component.item.variations[0].sku);
  });

  it('should display the correct number of select elements', () => {
    component.sortedVarations =  getSortedVariation(item);

    fixture.detectChanges();

    const selectElements = fixture.nativeElement.querySelectorAll('select');
    expect(selectElements.length).toBe(component.sortedVarations.length);
  });

  it('should display the correct number of option elements', () => {
    component.sortedVarations = getSortedVariation(item);
    fixture.detectChanges();

    const selectElements: HTMLElement[] = fixture.nativeElement.querySelectorAll('select');
    expect(selectElements.length).toBe(component.item.variations.length);
  });

});

