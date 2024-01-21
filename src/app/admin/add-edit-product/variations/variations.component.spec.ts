import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationsComponent } from './variations.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ErrorComponent } from 'src/app/error/error.component';
import { ImageComponent } from '../image/image.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VariationsService } from './variations.service';
import { MatDialog } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';

describe('VariationsComponent', () => {
  let component: VariationsComponent;
  let fixture: ComponentFixture<VariationsComponent>;
  let testControler: HttpTestingController;
  let produkt: iProduct;
  let vari: iProduktVariations;
  let vari2: iProduktVariations;
  let variAr: iProduktVariations[];
  let element: HTMLElement;


  beforeEach(() => {
    setTestData();
    TestBed.configureTestingModule({
      imports: [VariationsComponent, MatButtonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule, ErrorComponent, MatInputModule,
        MatIconModule, ImageComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        VariationsService,
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        }
      }]
    });
    fixture = TestBed.createComponent(VariationsComponent);
    component = fixture.componentInstance;
    testControler = TestBed.inject(HttpTestingController);
    component.product = produkt;

  });
  afterEach(() => {
    jest.resetAllMocks();
    testControler.verify();
  })
  it('should create', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);

    expect(component).toBeTruthy();
  });
  it('should display product variations table when product is present', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    const tableElement = element.querySelectorAll('tr');
    expect(tableElement).toBeTruthy();
    expect(component.product).toBeDefined();
    expect(tableElement.length).toBe(2);
  });

  it('should not display product variations table when no product is present', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    component.product = undefined as unknown as iProduct;
    fixture.detectChanges();
    const tableElement = element.querySelector('table.mat-table');
    expect(tableElement).toBeFalsy();
  });

  it('should display "Product Data nicht gefunden!" when no product data is found', () => {
    component.product = undefined as unknown as iProduct;
    element = getFirstRequest(testControler, [], fixture, element);

    fixture.detectChanges();
    const noDataElement = element.querySelector('.nodata');
    expect(noDataElement?.textContent).toContain('Product Data nicht gefunden!');
  });

  it('should display "Es gibt kein Variationen!" when there are no variations', () => {
    element = getFirstRequest(testControler, [], fixture, element);
    fixture.detectChanges();
    const noVariationsElement = element.querySelector('.select');
    expect(noVariationsElement?.textContent).toContain('Es gibt kein Variationen!');
  });

  it('should call addVariation() method when "Variation Hinzufügen" button is clicked', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    jest.spyOn(component, 'addVariation');
    const addButton = fixture.nativeElement.querySelector('#addVariation');
    addButton.click();
    fixture.detectChanges();
    expect(component.addVariation).toHaveBeenCalled();
  });

  it('should call addNeueVariation() method when "Neue Variation hinzufügen" button is clicked', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    jest.spyOn(component, 'addNeueVariation');
    const newVariationButton = element.querySelector('button[color="primary"]');
    newVariationButton?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.addNeueVariation).toHaveBeenCalled();
  });

  it('should call deleteVariation() method with the correct SKU when delete button is clicked', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    jest.spyOn(component, 'deleteVariation');
    const deleteButton = element.querySelector('button[color="warn"]');
    deleteButton?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    const delRequ = testControler.expectOne(environment.api + 'variation/'+vari.sku);
    expect(delRequ.request.method).toBe('DELETE');
    delRequ.flush({raw : '', affected: 1})

    fixture.detectChanges();
    expect(component.deleteVariation).toHaveBeenCalledWith(component.product.variations[0].sku);
  });

  it('should update variation when input fields are changed', () => {
    element = getFirstRequest(testControler, variAr, fixture, element);
    jest.spyOn(component, 'changesInVariation');
    const inputField = element.querySelector('input[type="number"]');
    inputField?.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    expect(component.changesInVariation).toHaveBeenCalled();
  });
  function setTestData() {
    variAr = [];
    vari = {
      sku: 'asjd_asd',
      produkt: { id : 1},
      variations_name: 'piwko',
      hint: '',
      value: 'jasne',
      unit: 'kg',
      image: '',
      price: 2,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 12,
      quanity_sold: 7,
      quanity_sold_at_once: 1
    };
    vari2 = {
      sku: 'asjd_asdnasdjasgh',
      produkt: { id : 2},
      variations_name: 'kawcia',
      hint: 'cim',
      value: '0.5',
      unit: 'kg',
      image: '',
      price: 2,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 12,
      quanity_sold: 7,
      quanity_sold_at_once: 1
    };
    produkt  = {
      id: 1,
      name: 'hjdgas as as',
      sku: 'asjd',
      artid: 0,
      beschreibung: ' kjasdg gsda ',
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
      variations: [vari],
      produkt_image: '',
      shipping_costs: []
    };
    variAr = [vari, vari2];
  }
});
function getFirstRequest(testControler: HttpTestingController, variAr: iProduktVariations[], fixture: ComponentFixture<VariationsComponent>, element: HTMLElement) {
  const requ = testControler.expectOne(environment.api + 'variation');
  expect(requ.request.method).toBe('GET');
  requ.flush(variAr);
  fixture.detectChanges();
  element = fixture.nativeElement;
  return element;
}

