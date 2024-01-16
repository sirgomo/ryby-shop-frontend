import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, of, tap } from 'rxjs';
import { ArtikelListComponent } from './artikel-list.component';
import { WareneingangService } from '../wareneingang.service';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { MatTableModule } from '@angular/material/table';
import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArtikelListComponent', () => {
  let component: ArtikelListComponent;
  let fixture: ComponentFixture<ArtikelListComponent>;
  let wEingService: WareneingangService;
  let dialog: MatDialog;

  let products: iProduct[] = [];


  const dialogMock = {
    open: jest.fn(),
  };

  beforeEach(

    waitForAsync( () => {
     TestBed.configureTestingModule({
      declarations: [ArtikelListComponent],
      imports: [MatTableModule, HttpClientTestingModule],
      providers: [
        WareneingangService,
        { provide: MatDialog, useValue: dialogMock },
      ],
    })
    .compileComponents()
    .then( () => {
    fixture = TestBed.createComponent(ArtikelListComponent);
    component = fixture.componentInstance;
    wEingService = TestBed.inject(WareneingangService);
    dialog = TestBed.inject(MatDialog);
    wEingService.lieferantIdSig = signal<number>(0);
    wEingService.lieferantIdSig.set(1);
    jest.spyOn(wEingService, 'getProduktsForWarenEingang').mockReturnValue(of(products));
    fixture.detectChanges();
      })
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products', () => {


    fixture.detectChanges();

    expect(wEingService.getProduktsForWarenEingang).toHaveBeenCalled();
    const tableRows = fixture.nativeElement.querySelectorAll('tr');

    expect(tableRows.length).toBe(3); // Header row + 2 product rows

    const prodIdCells = fixture.nativeElement.querySelectorAll('td.mat-column-prodid');
    expect(prodIdCells[0].textContent).toBe(' 1 ');
    expect(prodIdCells[1].textContent).toBe(' 2 ');

    const artIdCells = fixture.nativeElement.querySelectorAll('td.mat-column-artid');
    expect(artIdCells[0].textContent).toBe(' 1 ');
    expect(artIdCells[1].textContent).toBe(' 2 ');

    const nameCells = fixture.nativeElement.querySelectorAll('td.mat-column-name');
    expect(nameCells[0].textContent).toBe(' Product 1 ');
    expect(nameCells[1].textContent).toBe(' Product 2 ');


  });

  it('should call addProduct method when button is clicked', () => {
    fixture.detectChanges();
    jest.spyOn(component, 'addProduct').mockImplementation();
      const addButton = fixture.nativeElement.querySelector('button');
      addButton.click();
      expect(component.addProduct).toHaveBeenCalled();

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
      sku: 'akjsdh jha',
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
