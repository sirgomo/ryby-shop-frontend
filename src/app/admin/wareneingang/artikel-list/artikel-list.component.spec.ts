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

  const products: iProduct[] = [
    {
      id: 1,
      name: 'Product 1',
      artid: 1,
      beschreibung: 'Description 1',
      color: 'red',
      foto: 'photo1.jpg',
      thumbnail: 'thumbnail1.jpg',
      lieferant: {
        id: 1,
        name: 'Lieferant 1',
        adresse: 'Adresse 1',
      } as unknown as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '2021-01-01',
      kategorie: [],
      verfgbarkeit: true,
      preis: Number('2,24'),
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
      bewertung: [],
    },
    {
      id: 2,
      name: 'Product 2',
      artid: 2,
      beschreibung: 'Description 2',
      color: 'blue',
      foto: 'photo2.jpg',
      thumbnail: 'thumbnail2.jpg',
      lieferant: {
        id: 2,
        name: 'Lieferant 2',
        adresse: 'Adresse 2',
      } as unknown as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '2021-01-02',
      kategorie: [],
      verfgbarkeit: true,
      preis: Number('2,24'),
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
      bewertung: [],
    },
  ];


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

    expect(wEingService.getProduktsForWarenEingang).toBeCalled();
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
});
