import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { EbayOffersComponent } from './ebay-offers.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddEditProductComponent } from 'src/app/admin/add-edit-product/add-edit-product.component';
import { ErrorComponent } from 'src/app/error/error.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { ShippingCostService } from 'src/app/admin/shipping-cost/shipping-cost.service';
import { EbayInventoryService } from '../ebay-inventory/ebay-inventory.service';
import { EbayOffersService } from './ebay-offers.service';
import { IShippingCost } from 'src/app/model/iShippingCost';
import { JwtModule } from '@auth0/angular-jwt';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { iEbayGroupItem } from 'src/app/model/ebay/iEbayGroupItem';
import { iLieferant } from 'src/app/model/iLieferant';
import { iKategorie } from 'src/app/model/iKategorie';

describe('EbayOffersComponent', () => {
  let component: EbayOffersComponent;
  let fixture: ComponentFixture<EbayOffersComponent>;
  let httpTest: HttpTestingController;
  let shippingCost: IShippingCost[] = [];
  let itemGroup: iEbayGroupItem;
  let liferanst: iLieferant;
  let kat: iKategorie;
  let group = {
    groupIds: ['hgdasgdhjag217836'],
    description: 'kjahsd12783',
  } as unknown as iEbayInventoryItem | iEbayGroupItem;
  beforeEach(() => {
    loadTestData();
    TestBed.configureTestingModule({
      imports: [EbayOffersComponent, HttpClientTestingModule, CommonModule, ErrorComponent,
         MatIconModule, AddEditProductComponent, MatProgressSpinnerModule, MatDialogModule, JwtModule.forRoot({
          config: {
            tokenGetter: jest.fn(),
          }
         }), MatMomentDateModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: group,
        },
        ShippingCostService,
        EbayInventoryService,
        EbayOffersService,
      ]
    });
    fixture = TestBed.createComponent(EbayOffersComponent);
    httpTest = TestBed.inject(HttpTestingController),
    component = fixture.componentInstance;

  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTest.verify();
    jest.resetAllMocks();
  });

  it('it should open dialog with add edit produkt', async () => {
    fixture.detectChanges();
    const shipCost1: IShippingCost = {
      id: 1,
      shipping_name: 'dhl',
      shipping_price: 1.5,
      average_material_price: 0,
      cost_per_added_stuck: 0
    };
    const shipCost2: IShippingCost = {
      id: 2,
      shipping_name: 'gls',
      shipping_price: 2.5,
      average_material_price: 0,
      cost_per_added_stuck: 0
    };
    const req = httpTest.expectOne(environment.api + 'shipping');
    expect(req.request.method).toBe('GET');


    req.flush([shipCost1, shipCost2]);
    await fixture.whenStable();
    fixture.detectChanges();

    const req1 = httpTest.expectOne(environment.api + 'ebay-inventory/ebay/groupid/hgdasgdhjag217836');

    expect(req1.request.method).toBe('GET');
    req1.flush(itemGroup);
    await fixture.whenStable();

    expect(component.shippingServices).toEqual(shippingCost);
    const req2 = httpTest.expectOne(environment.api+'liferant');
    expect(req2.request.method).toBe('GET');
    req2.flush([liferanst]);
    await fixture.whenStable();
    const req3 = httpTest.expectOne(environment.api+'kategorie');
    expect(req3.request.method).toBe('GET');
    req3.flush([kat]);
    await fixture.whenStable();


  });

  //load data
  function loadTestData() {
    itemGroup  = {
      aspects: '',
      description: 'kjahsd12783',
      imageUrls: [],
      inventoryItemGroupKey: '',
      subtitle: '',
      title: '',
      variantSKUs: [],
      variesBy: {
        aspectsImageVariesBy: [],
        specifications: []
      },
      videoIds: []
    };
    liferanst = {
      id: undefined,
      name: 'lif',
      email: 'ahsdsjk',
      telefon: '123123123',
      adresse: {
        strasse: 'ashjakshd',
        hausnummer: 'jhasgjh 12',
        stadt: 'hjasg asdgh123',
        postleitzahl: '123217312',
        land: 'de'
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    kat = {
      id: 1,
      parent_id: null,
      name: 'piwo',
      products: []
    };
    shippingCost = [];
    const shipCost1: IShippingCost = {
      id: 1,
      shipping_name: 'dhl',
      shipping_price: 1.5,
      average_material_price: 0,
      cost_per_added_stuck: 0
    };
    const shipCost2: IShippingCost = {
      id: 2,
      shipping_name: 'gls',
      shipping_price: 2.5,
      average_material_price: 0,
      cost_per_added_stuck: 0
    };
    shippingCost.push(shipCost1);
    shippingCost.push(shipCost2);
  }
});
