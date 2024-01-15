import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EbayInventoryComponent } from './ebay-inventory.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorComponent } from 'src/app/error/error.component';
import { EbayOffersComponent } from '../ebay-offers/ebay-offers.component';
import { ImportEbayListingsComponent } from './import-ebay-listings/import-ebay-listings.component';
import { EbayInventoryService } from './ebay-inventory.service';
import { ErrorService } from 'src/app/error/error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { LocaleEnum, iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { By } from '@angular/platform-browser';

describe('EbayInventoryComponent', () => {
  let component: EbayInventoryComponent;
  let fixture: ComponentFixture<EbayInventoryComponent>;
  let testController: HttpTestingController;
  let ebayInventory: iEbayInventory;
  let inventoryItem: iEbayInventoryItem;
  let inventoryItem2: iEbayInventoryItem;
  let prod: iProduct;
  let prod2: iProduct;


  beforeEach(() => {
    getTestData();
    TestBed.configureTestingModule({
      imports: [EbayInventoryComponent, CommonModule, MatSelectModule, MatTableModule, MatButtonModule, FormsModule, MatTabsModule, ImportEbayListingsComponent, MatFormFieldModule,
        MatCheckboxModule, ErrorComponent, MatDialogModule, EbayOffersComponent, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        EbayInventoryService, ErrorService
      ],
    });
    fixture = TestBed.createComponent(EbayInventoryComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    testController.verify();
    jest.resetAllMocks();
  })

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
  it ('should get inventory items from ebay', async () => {
    fixture.detectChanges();
    const req = testController.expectOne(environment.api+'ebay-inventory/100/0');
    expect(req.request.method).toBe('GET');
    req.flush(ebayInventory)
    await fixture.whenStable();
    const req1 = testController.expectOne(environment.api+'ebay-inventory/group/asgdhgs');
    expect(req1.request.method).toBe('GET');
    req1.flush(prod)
    await fixture.whenStable();
    const req2 = testController.expectOne(environment.api+'ebay-inventory/group/njsdg');
    expect(req2.request.method).toBe('GET');
    req2.flush(prod2)
    fixture.detectChanges();

      // Query for the table rows in the rendered output
      const tableRows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

      // Assert that there are the expected number of rows
      expect(tableRows.length).toBe(2); // Replace with the expected number of rows
  })
  function getTestData() {
    inventoryItem = {
      groupIds: ['asgdhgs'],
      product: {
        description: 'jashd',
      },
      locale: LocaleEnum.de_DE,
    };
    inventoryItem2 = {
      groupIds: ['njsdg'],
      product: {
        description: 'asjkdg',
      },
      locale: LocaleEnum.de_DE,
    };

    ebayInventory  = {
      href: 'bjasjdh',
      inventoryItems: [inventoryItem, inventoryItem2],
      limit: 0,
      size: 0,
      total: 0
    };
  prod  = {
    id: 1,
    name: 'kjdajhsdahsdhj',
    sku: 'asgdhgs',
    artid: 0,
    beschreibung: 'amsdmh ashd jahsdh asdh  ',
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
  prod2  = {
    id: 123,
    name: 'akshdjasdj',
    sku: 'njsdg',
    artid: 0,
    beschreibung: 'hjahsd askjdha kjsd',
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
  }
});
