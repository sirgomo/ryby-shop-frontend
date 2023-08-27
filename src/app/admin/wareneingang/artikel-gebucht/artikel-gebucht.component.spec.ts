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

describe('ArtikelGebuchtComponent', () => {
  let component: ArtikelGebuchtComponent;
  let fixture: ComponentFixture<ArtikelGebuchtComponent>;
  let wEingService: WareneingangService;
  let dialog: MatDialog;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, HttpClientTestingModule, MatTableModule, MatIconModule,],
      declarations: [ArtikelGebuchtComponent],
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
    const products: iWareneingangProduct[] = [
      {
        id: 1,
        wareneingang: null,
        produkt: [],
        menge: 10,
        preis: 5,
        mwst: 20,
        mengeEingelagert: 10,
        color: 'red',
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
      menge: 10,
      preis: 5,
      mwst: 20,
      mengeEingelagert: 10,
      color: 'red',
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
      menge: 10,
      preis: 5,
      mwst: 20,
      mengeEingelagert: 10,
      color: 'red',
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
      eingelagert: false
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
