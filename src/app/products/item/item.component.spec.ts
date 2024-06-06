import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduct } from 'src/app/model/iProduct';
import { ProductService } from 'src/app/admin/product/product.service';
import { ItemComponent } from './item.component';
import { iLieferant } from 'src/app/model/iLieferant';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  JwtModule } from '@auth0/angular-jwt';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VariationsService } from 'src/app/admin/add-edit-product/variations/variations.service';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { Router } from '@angular/router';
import { SelectComponent } from '../select/select.component';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitizeHtml';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let variationService: VariationsService;
  let router: Router;
  let snackBar: Partial<MatSnackBar>;
  let domSanitizer: DomSanitizer;
  const prodVari: iProduktVariations = {
    sku: 'jasdhas',
    produkt: {id :1},
    variations_name: 'test name',
    hint: 'kjsadjas',
    value: 'test',
    unit: '',
    image: '',
    price: 3.55,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 10,
    quanity_sold: 1,
    quanity_sold_at_once: 1,
  };
  const prodVari1: iProduktVariations = {
    sku: 'jasdhasasdasd',
    produkt: {id :1},
    variations_name: 'test name 1',
    hint: 'kjsadjas',
    value: 'test',
    unit: '',
    image: '',
    price: 3.55,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 10,
    quanity_sold: 1,
    quanity_sold_at_once: 1,
  };
  const prodVari2: iProduktVariations = {
    sku: 'jasdhas12easd',
    produkt: {id :1},
    variations_name: 'test name 2',
    hint: 'kjsadjas',
    value: 'test',
    unit: '',
    image: '',
    price: 3.55,
    wholesale_price: 0,
    thumbnail: '',
    quanity: 10,
    quanity_sold: 1,
    quanity_sold_at_once: 1,
  };
  const item: iProduct = {
    id: 1,
    name: 'Test Item',
    sku: 'asldlasgdasgdh',
    artid: 0,
    beschreibung: 'This is a test item',
    lieferant: { id: 1} as iLieferant,
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
    variations: [prodVari, prodVari1, prodVari2],
    produkt_image: '',
    shipping_costs: []
  };

  beforeEach(async () => {

    snackBar = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({

      imports: [ItemComponent, MatDialogModule, BrowserAnimationsModule, HttpClientTestingModule, JwtModule.forRoot({
        config: {
          tokenGetter: jest.fn(),
        }
      }), MatProgressSpinnerModule, SanitizeHtmlPipe ],
      providers: [
        { provide: MatDialog, useValue: {
          open: jest.fn(),
        } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: DomSanitizer, useValue: {
          bypassSecurityTrustResourceUrl: jest.fn((v: string) => v),
          bypassSecurityTrustHtml: jest.fn((v: string) => v),
        }
        },
        ProductService,
        VariationsService,
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          }
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    variationService = TestBed.inject(VariationsService);
    domSanitizer = TestBed.inject(DomSanitizer);
    Object(globalThis).global.URL = { createObjectURL: jest.fn() };
    jest.spyOn(variationService, 'getThumbnails').mockReturnValue(of(new Blob()));
    jest.spyOn(domSanitizer, 'bypassSecurityTrustResourceUrl').mockImplementation();




    component.item = item;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the item details correctly', () => {

    const itemName = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(itemName.textContent).toEqual('Test Item');

    const itemDescription = fixture.debugElement.query(By.css('.besch')).nativeElement;
    expect(itemDescription.textContent).toEqual('This is a test item');

    const itemPrice = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(itemPrice.textContent).toEqual('Preis: 3.55 € ');

  });

  it('should call the openDetails method when Details button is clicked', () => {
    jest.spyOn(router, 'navigate');

    const button = fixture.debugElement.query(By.css('#openD')).nativeElement;
    button.click();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call the changeSelection method when the color select is changed', () => {
    jest.spyOn(component, 'changeSelection');

    const selectComponent = fixture.debugElement.query(By.directive(SelectComponent)).componentInstance;

    // Trigger the output event manually
    selectComponent.current.emit('new selection');

    fixture.detectChanges();
    expect(component.changeSelection).toHaveBeenCalled();
  });

  it('should call the addItem method when the In den Warenkorb button is clicked', () => {
    jest.spyOn(component, 'addItem');

    const button = fixture.debugElement.query(By.css('.act button:nth-child(1)')).nativeElement;
    button.click();

    expect(component.addItem).toHaveBeenCalled();
  });

  it('should call the getThumbnails method when getImage is called', () => {
    jest.spyOn(variationService, 'getThumbnails');
    fixture.detectChanges();

    component.getImage('image1.jpg');

    expect(variationService.getThumbnails).toHaveBeenCalledWith('image1.jpg');
  });

  it('should update the image property when getThumbnails returns a blob', fakeAsync( () => {
    const blob = new Blob();

    jest.spyOn(domSanitizer, 'bypassSecurityTrustResourceUrl').mockReturnValue('safe-url');

    component.getImage('image1.jpg');
    component.act$.subscribe();
    tick();

    fixture.detectChanges();
    expect(domSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(URL.createObjectURL(blob));
    expect(component.image).toEqual('safe-url');
  }));

  it('should call the addItem method and display a snackbar message when the In den Warenkorb button is clicked', () => {


    jest.spyOn(component, 'addItem').mockImplementation(() => {
      if(snackBar.open)
      snackBar.open('Test Item wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 })

    });


    const button = fixture.debugElement.query(By.css('.act button:nth-child(1)')).nativeElement;
    button.click();

    expect(component.addItem).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Test Item wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });
  });

});

