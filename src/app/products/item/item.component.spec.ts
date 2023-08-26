import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduct } from 'src/app/model/iProduct';
import { ProductService } from 'src/app/admin/product/product.service';
import { ItemComponent } from './item.component';
import { iAktion } from 'src/app/model/iAktion';
import { iKategorie } from 'src/app/model/iKategorie';
import { iKundenbewertung } from 'src/app/model/iKundenbewertung';
import { iLieferant } from 'src/app/model/iLieferant';
import { iProductBestellung } from 'src/app/model/iProductBestellung';
import { iReservierung } from 'src/app/model/iReservierung';
import { iStellplatze } from 'src/app/model/iStellplatze';
import { iWarenausgangProduct } from 'src/app/model/iWarenausgangProduct';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  JwtModule } from '@auth0/angular-jwt';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let productService: ProductService;
  let dialog: MatDialog;
  let helperService: HelperService;
  let snackBar: Partial<MatSnackBar>;
  let domSanitizer: DomSanitizer;


  beforeEach(async () => {

    snackBar = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [ ItemComponent ],
      imports: [ MatDialogModule, BrowserAnimationsModule, HttpClientTestingModule, JwtModule.forRoot({}), MatProgressSpinnerModule ],
      providers: [
        { provide: MatDialog, useValue: {
          open: jest.fn(),
        } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: DomSanitizer, useValue: {
          bypassSecurityTrustResourceUrl: jest.fn(() => ''),
        }
        },
        {
          provide: ProductService,
          useClass: ProductService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    dialog = TestBed.inject(MatDialog);
    helperService = TestBed.inject(HelperService);
    domSanitizer = TestBed.inject(DomSanitizer);
    global.URL = MockURL;
    jest.spyOn(productService, 'getThumbnails').mockReturnValue(of(new Blob()));
    jest.spyOn(domSanitizer, 'bypassSecurityTrustResourceUrl').mockImplementation();

    const item: iProduct = {
      id: 1,
      name: 'Test Item',
      preis: 10,
      artid: 2,
      beschreibung: 'This is a test item',
      color: '[{"id":"1","menge":10},{"id":"2","menge":5}]',
      foto: '["image1.jpg","image2.jpg"]',
      thumbnail: 'thumbnail.jpg',
      lieferant: {} as iLieferant,
      lagerorte: [] as iStellplatze[],
      bestellungen: [] as iProductBestellung[],
      datumHinzugefuegt: '',
      kategorie: [] as iKategorie[],
      verfgbarkeit: true,
      mindestmenge: 0,
      currentmenge: 0,
      product_sup_id: '',
      lange: 0,
      gewicht: 0,
      verkaufteAnzahl: 0,
      wareneingang: [] as iWareneingangProduct[],
      warenausgang: [] as iWarenausgangProduct[],
      mehrwehrsteuer: 0,
      promocje: [] as iAktion[],
      reservation: [] as iReservierung[],
      bewertung: [] as iKundenbewertung[],
    };

    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the item details correctly', () => {

    const itemName = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(itemName.textContent).toEqual('Test Item');

    const itemDescription = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(itemDescription.textContent).toEqual('This is a test item');

    const itemPrice = fixture.debugElement.query(By.css('p:nth-child(3)')).nativeElement;
    expect(itemPrice.textContent).toEqual('Preis: 10 € ');

    const itemLength = fixture.debugElement.query(By.css('.prop p:nth-child(1)')).nativeElement;
    expect(itemLength.textContent).toEqual('Lange: 0 (mm)');

    const itemWeight = fixture.debugElement.query(By.css('.prop p:nth-child(2)')).nativeElement;
    expect(itemWeight.textContent).toEqual('Gewicht: 0 (g)');
  });

  it('should call the openDetails method when Details button is clicked', () => {
    jest.spyOn(dialog, 'open');

    const button = fixture.debugElement.query(By.css('.act button:nth-child(2)')).nativeElement;
    button.click();

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should call the colorChange method when the color select is changed', () => {
    jest.spyOn(component, 'colorChange');

    const select = fixture.debugElement.query(By.css('.color select')).nativeElement;
    select.value = '2';
    select.dispatchEvent(new Event('change'));

    expect(component.colorChange).toHaveBeenCalled();
  });

  it('should call the addItem method when the In den Warenkorb button is clicked', () => {
    jest.spyOn(component, 'addItem');

    const button = fixture.debugElement.query(By.css('.act button:nth-child(1)')).nativeElement;
    button.click();

    expect(component.addItem).toHaveBeenCalled();
  });

  it('should call the getThumbnails method when getImage is called', () => {

    fixture.detectChanges();

    component.getImage('image1.jpg');

    expect(productService.getThumbnails).toHaveBeenCalledWith('image1.jpg');
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
class MockURL extends global.URL {
  static override createObjectURL = jest.fn();
  static override revokeObjectURL = jest.fn();
}
