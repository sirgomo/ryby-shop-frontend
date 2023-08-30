import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ItemDetailsComponent } from './item-details.component';
import { ProductService } from 'src/app/admin/product/product.service';
import { HelperService } from 'src/app/helper/helper.service';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { iProduct } from 'src/app/model/iProduct';
import { iLieferant } from 'src/app/model/iLieferant';
import { JwtModule } from '@auth0/angular-jwt';
import { iKategorie } from 'src/app/model/iKategorie';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;
  let productService: ProductService;
  let helperService: HelperService;
  let snackBar: MatSnackBar;
  let santizier: DomSanitizer;



  const mockMatDialogData: iProduct = {
    id: 1,
    name: 'Test Item',
    preis: 10,
    artid: 1,
    beschreibung: 'Test Description',
    color: JSON.stringify([{ id: 'blue', menge: 5 }, { id: 'red', menge: 10 }]),
    foto: JSON.stringify(['image1.jpg', 'image2.jpg']),
    thumbnail: 'thumbnail.jpg',
    lieferant: { id: 1, name: 'Test Supplier' } as iLieferant,
    lagerorte: [{ id: 1, name: 'Test Storage' }],
    bestellungen: [],
    datumHinzugefuegt: '2022-01-01',
    kategorie: [{ id: 1, name: 'Test Category' } as iKategorie],
    verfgbarkeit: true,
    mindestmenge: 1,
    currentmenge: 10,
    product_sup_id: '12345',
    lange: 50,
    gewicht: 100,
    verkaufteAnzahl: 20,
    wareneingang: [],
    warenausgang: [],
    mehrwehrsteuer: 20,
    promocje: [],
    bewertung: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemDetailsComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCheckboxModule,
        JwtModule.forRoot({}),
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: DomSanitizer, useValue: {
          bypassSecurityTrustResourceUrl: jest.fn(),
        }},
        { provide: MatSnackBar, useValue: {
          open: jest.fn(),
        }},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    helperService = TestBed.inject(HelperService);
    snackBar = TestBed.inject(MatSnackBar);
    santizier = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
    jest.spyOn(santizier, 'bypassSecurityTrustResourceUrl').mockReturnValue(() => 'url');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title', () => {

    component.ngOnInit();
    expect(helperService.titelSig()).toBe('Ryby Test Category Test Item');
  });

  it('should get the product details', fakeAsync(() => {
    jest.spyOn(productService, 'getProductById').mockReturnValue(of(mockMatDialogData));
    component.ngOnInit();
    component.act$.subscribe();
    tick();

    expect(component.item).toEqual(mockMatDialogData);
    expect(component.fotos).toEqual(['image1.jpg', 'image2.jpg']);
    expect(component.color).toEqual([{ id: 'blue', menge: 5 }, { id: 'red', menge: 10 }]);
  }));

  it('should change the displayed image', fakeAsync( () => {
    component.fotos = ['image1.jpg', 'image2.jpg'];
    component.color = [{ id: 'blue', menge: 5 }, { id: 'red', menge: 10 }];
    jest.spyOn(productService, 'getImage').mockReturnValue(of(new Blob()));
    global.URL.createObjectURL = jest.fn(() => 'image');
    component.changeImage(1);
    component.act$.subscribe();
    tick();

    fixture.detectChanges();
    expect(component.currentImage).toBeTruthy();
    expect(component.colorToBuy).toEqual([{ id: 'red', menge: 0 }]);
  }));

  it('should add a color to colorToBuy array', () => {
    component.color = [{ id: 'blue', menge: 5 }, { id: 'red', menge: 10 }];
    component.colorToBuy = [{ id: 'blue', menge: 0 }];
    const event = { checked: true };
    component.addColor('red', event);
    expect(component.colorToBuy).toEqual([{ id: 'blue', menge: 0 }, { id: 'red', menge: 0 }]);
  });

  it('should remove a color from colorToBuy array', () => {
    component.color = [{ id: 'blue', menge: 5 }, { id: 'red', menge: 10 }];
    component.colorToBuy = [{ id: 'blue', menge: 0 }, { id: 'red', menge: 0 }];
    const event = { checked: false };
    component.addColor('red', event);
    expect(component.colorToBuy).toEqual([{ id: 'blue', menge: 0 }]);
  });

  it('should add the item to the cart', () => {
    jest.spyOn(helperService.cardSig, 'set');
    jest.spyOn(snackBar, 'open');
    component.addItem(mockMatDialogData);
    expect(helperService.cardSig.set).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Test Item wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });
  });
});
