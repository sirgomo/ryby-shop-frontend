import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { WareneingangService } from '../wareneingang.service';
import { ArtikelGebuchtComponent } from './artikel-gebucht.component';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { iLieferant } from 'src/app/model/iLieferant';
import { AddEditBuchungComponent } from '../add-edit-buchung/add-edit-buchung.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { iLager } from 'src/app/model/iLager';
import { iWarenEingangProdVariation } from 'src/app/model/iWarenEingangProdVariation';
import { iProduct } from 'src/app/model/iProduct';

describe('ArtikelGebuchtComponent', () => {
  let component: ArtikelGebuchtComponent;
  let fixture: ComponentFixture<ArtikelGebuchtComponent>;
  let wEingService: WareneingangService;
  let dialog: MatDialog;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [ArtikelGebuchtComponent, BrowserAnimationsModule, MatDialogModule, HttpClientTestingModule, MatTableModule, MatIconModule,],
      providers: [WareneingangService, MatDialog],
    })
    .compileComponents()
    .then(() => {
    fixture = TestBed.createComponent(ArtikelGebuchtComponent);
    component = fixture.componentInstance;
    wEingService = TestBed.inject(WareneingangService);
    dialog = TestBed.inject(MatDialog);
    wEingService.currentProductsInBuchungSig.set([]);
    fixture.detectChanges();
      })
    })
  );


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No data available" if there are no products in the current buchung', () => {

    fixture.detectChanges();

    const noDataAvailableElement = fixture.debugElement.query(By.css('p'));
    expect(noDataAvailableElement).toBeTruthy();

    expect(noDataAvailableElement.nativeElement.textContent).toBe('No data available');
  });

  it('should display the table if there are products in the current buchung', () => {
    const item:iWarenEingangProdVariation = {
      sku: 'asdasd',
      quanity: 1,
      price: 2.2,
      price_in_euro: 2.2,
      wholesale_price: 0,
      mwst: 0,
      quanity_stored: 0,
      quanity_sold_at_once: 0,
      waren_eingang_product: { id: 1} as iWareneingangProduct
    };
    const prod:iProduct = {
      id: undefined,
      name: '',
      sku: 'asdasd',
      artid: 0,
      beschreibung: '',
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
    const products: iWareneingangProduct[] = [
      {
        id: 1,
        wareneingang: { id: 1} as iWarenEingang,
        produkt: [prod],
        product_variation: [item],
      },
    ];
    wEingService.currentProductsInBuchungSig.set(products);
    fixture.detectChanges();

    const tableElement = fixture.debugElement.query(By.css('table'));
    expect(tableElement).toBeTruthy();
  });

  it('should open the dialog when edit button is clicked', () => {
    const product: iWareneingangProduct = {
      id: 1,
      wareneingang: null,
      produkt: [],
      product_variation: [],
    };
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);

    component.editProduct(product);

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should call the deleteProductFromWarenEingang method when delete button is clicked', () => {
    const product: iWareneingangProduct = {
      id: 1,
        wareneingang: null,
        produkt: [],
        product_variation: [],
    };
    const warenEin: iWarenEingang = {
      id: 1,
      products: [],
      lieferant: {} as iLieferant,
      empfangsdatum: '',
      rechnung: '',
      lieferscheinNr: '',
      datenEingabe: '',
      gebucht: false,
      eingelagert: false,
      shipping_cost: 0,
      remarks: '',
      other_cost: 0,
      location: {} as iLager,
      wahrung: '',
      wahrung2: '',
      wahrung_rate: 0,
      shipping_cost_eur: 0,
      other_cost_eur: 0
    };
    const curr = { data: warenEin } as AddEditBuchungComponent;

    wEingService.currentWarenEingangSig.set(curr);
    const deleteProductFromWarenEingangSpy = jest.spyOn(wEingService, 'deleteProductFromWarenEingang').mockReturnValue(of({ affected: 1, raw: '' }));

    component.deleteProductFromBuchung(product);
    component.act$.subscribe();
    fixture.detectChanges();
    expect(deleteProductFromWarenEingangSpy).toHaveBeenCalled();
  });
});
