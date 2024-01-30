import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, of, tap } from 'rxjs';
import { ArtikelListComponent } from './artikel-list.component';
import { WareneingangService } from '../wareneingang.service';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { MatTableModule } from '@angular/material/table';
import { signal } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ArtikelListComponent', () => {
  let component: ArtikelListComponent;
  let fixture: ComponentFixture<ArtikelListComponent>;
  let testController: HttpTestingController;

  let dialog: MatDialog;

  let products: iProduct[] = [];


  const dialogMock = {
    open: jest.fn(),
  };
  loadTestData();
  beforeEach(
    waitForAsync( () => {
     TestBed.configureTestingModule({

      imports: [ArtikelListComponent, MatTableModule, HttpClientTestingModule],
      providers: [
        WareneingangService,
        { provide: MatDialog, useValue: dialogMock },
      ],
    })
    .compileComponents()
    .then( () => {
    fixture = TestBed.createComponent(ArtikelListComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
    const requ = testController.expectOne(environment.api+'waren-eingang-buchen');
    expect(requ.request.method).toBe('GET');
    requ.flush(products);
    const requ2 = testController.expectOne(environment.api+'product/lieferant/0');
    expect(requ2.request.method).toBe('GET');
    requ2.flush(products);
      })
    })
  );
  afterEach(() => {
    testController.verify();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products',  () => {
    fixture.detectChanges();



    const tableRows = fixture.nativeElement.querySelectorAll('tr');

    expect(tableRows.length).toBe(3); // Header row + 2 product rows

    const prodIdCells = fixture.nativeElement.querySelectorAll('td.mat-column-sku');
    expect(prodIdCells[0].textContent).toBe(' akjsdh jha ');
    expect(prodIdCells[1].textContent).toBe(' akjsdh jha a ');

    const artIdCells = fixture.nativeElement.querySelectorAll('td.mat-column-artid');
    expect(artIdCells[0].textContent).toBe(' 1 ');
    expect(artIdCells[1].textContent).toBe(' 2 ');

    const nameCells = fixture.nativeElement.querySelectorAll('td.mat-column-name');
    expect(nameCells[0].textContent).toBe(' Product 1 ');
    expect(nameCells[1].textContent).toBe(' Product 2 ');


  });

  it('should call addProduct method when button is clicked', () => {
    jest.spyOn(component, 'addProduct');
    fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector('button');
      addButton.click();
      fixture.detectChanges();
    expect(component.addProduct).toHaveBeenCalledTimes(1);
  });

  it('should open dialog when addProduct method is called', () => {
    component.addProduct(products[0]);
    expect(dialog.open).toHaveBeenCalled();
  });
  function loadTestData() {
    products = [];
    const prod: iProduct = {
      id: 1,
      name: 'Product 1',
      sku: 'akjsdh jha',
      artid: 1,
      beschreibung: 'hagsd ha asd hg ga ashd ghas',
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
    const prod2: iProduct = {
      id: 2,
      name: 'Product 2',
      sku: 'akjsdh jha a',
      artid: 2,
      beschreibung: 'hagsd ha asd hg ga ashd ghas',
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
    products.push(prod);
    products.push(prod2);
  }
});
