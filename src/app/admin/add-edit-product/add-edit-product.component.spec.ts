import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AddEditProductComponent } from './add-edit-product.component';
import { ProductService } from '../product/product.service';
import { LiferantsService } from '../liferants/liferants.service';
import { KategorieService } from '../kategories/kategorie.service';
import { HelperService } from 'src/app/helper/helper.service';
import { ErrorService } from 'src/app/error/error.service';
import { EMPTY, of } from 'rxjs';
import { iProduct } from 'src/app/model/iProduct';
import { iColor } from 'src/app/model/iColor';
import { iLieferant } from 'src/app/model/iLieferant';
import {  WritableSignal } from '@angular/core';
import { iDelete } from 'src/app/model/iDelete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

describe('AddEditProductComponent', () => {
  let component: AddEditProductComponent;
  let fixture: ComponentFixture<AddEditProductComponent>;
  let dialogRefMock: Partial<MatDialogRef<AddEditProductComponent>>;
  let productServiceMock: Partial<ProductService>;
  let liferantServiceMock: Partial<LiferantsService>;
  let kategorieServiceMock: Partial<KategorieService>;
  let helperServiceMock: Partial<HelperService>;
  let errorServiceMock: Partial<ErrorService>;
  let snackBarMock: Partial<MatSnackBar>;
  let sanitizerMock: Partial<DomSanitizer>;
  let dpipeMock: Partial<DatePipe>;


  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn()
    };

    productServiceMock = {
      getProductById: jest.fn().mockReturnValue(of({})),
      uploadPhoto: jest.fn().mockReturnValue(of({})),
      resetFotoUpload: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      getImage: jest.fn().mockReturnValue(of({})),
      deleteImage: jest.fn(),
    };

    liferantServiceMock = {
      liferants$: of([])
    };

    kategorieServiceMock = {
      kategorie$: of([])
    };
    helperServiceMock = {
      uploadProgersSig: jest.fn().mockReturnValue('') as unknown as WritableSignal<any>,
    };

    errorServiceMock = {};

    snackBarMock = {
      open: jest.fn()
    };

    sanitizerMock = {
      bypassSecurityTrustResourceUrl: jest.fn()
    };

    dpipeMock = {
      transform: jest.fn()
    };



    await TestBed.configureTestingModule({
      declarations: [AddEditProductComponent],
      imports: [MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatMomentDateModule, MatCheckboxModule, BrowserAnimationsModule, MatInputModule, MatProgressSpinnerModule, MatIconModule,],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: ProductService, useValue: productServiceMock },
        { provide: LiferantsService, useValue: liferantServiceMock },
        { provide: KategorieService, useValue: kategorieServiceMock },
        { provide: HelperService, useValue: helperServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
        { provide: DatePipe, useValue: dpipeMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductComponent);
    component = fixture.componentInstance;
    global.URL = MockURL;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getProductById if data has an id', () => {
      const item = { id: 1, name: 'Product 1' } as iProduct;
      const getProductByIdSpy = jest.spyOn(productServiceMock, 'getProductById').mockReturnValue(of(item));
      component.data = { id: 1 } as iProduct;

      component.ngOnInit();

      expect(getProductByIdSpy).toHaveBeenCalledWith(1);
    });

    it('should not call getProductById if data does not have an id', () => {
      const getProductByIdSpy = jest.spyOn(productServiceMock, 'getProductById').mockReturnValue(of({} as iProduct));


      component.ngOnInit();

      expect(getProductByIdSpy).not.toHaveBeenCalled();
    });

    it('should set the values of the productForm', fakeAsync( () => {
      const item: iProduct = {
        id: 1,
        name: 'Product 1',
        preis: 10,
        artid: 123,
        beschreibung: 'Product 1 description',
        foto: JSON.stringify(['image1.jpg']),
        thumbnail: 'thumbnail.jpg',
        lieferant: {} as iLieferant,
        lagerorte: [],
        bestellungen: [],
        datumHinzugefuegt: Date.now().toString(),
        kategorie: [],
        verfgbarkeit: false,
        mindestmenge: 5,
        currentmenge: 5,
        product_sup_id: 'ABC123',
        verkaufteAnzahl: 0,
        wareneingang: [],
        warenausgang: [],
        mehrwehrsteuer: 0,
        promocje: [],
        reservation: [],
        bewertung: [],
        color: JSON.stringify(['hjgasghd']),
        lange: 0,
        gewicht: 0
      };
      const itemForm = {
        id: 1,
        name: 'Product 1',
        preis: 10,
        artid: 123,
        beschreibung: 'Product 1 description',
        foto: JSON.stringify(['image1.jpg']),
        thumbnail: 'thumbnail.jpg',
        lieferant: {} as iLieferant,
        lagerorte: [],
        bestellungen: [],
        datumHinzugefuegt: Date.now().toString(),
        kategorie: [],
        verfgbarkeit: false,
        mindestmenge: 5,
        currentmenge: 5,
        product_sup_id: 'ABC123',
        verkaufteAnzahl: 0,
        wareneingang: [],
        warenausgang: [],
        mehrwehrsteuer: 0,
        promocje: [],
        reservation: [],
        bewertung: [],

      };
      jest.spyOn(productServiceMock, 'getProductById').mockReturnValue(of(item));
      component.data = {id: 1} as iProduct;
      component.ngOnInit();
      component.create$.subscribe();

      tick();
      fixture.detectChanges();

      expect(productServiceMock.getProductById).toBeCalledWith(1);
      expect(component.productForm.getRawValue()).toEqual(itemForm);
    }));

    it('should call getImage if images array is not empty', fakeAsync( () => {
      const getImageSpy = jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));
      const getItemById = jest.spyOn(productServiceMock, 'getProductById').mockReturnValue(of({
        preis: 20,
        foto: JSON.stringify(['image1.jpg']),
        color: JSON.stringify(['jkasdkas', 'kjasdjs']),
      } as iProduct));
      component.data = { id: 1 } as iProduct;
      component.images = ['image1.jpg'];

      component.ngOnInit()
      component.create$.subscribe();
      component.getFoto$.subscribe();
      tick();

      expect(getImageSpy).toHaveBeenCalledWith('image1.jpg');
    }));
  });

  describe('onFileChange', () => {
    it('should set the photoFile property', () => {
      const event = {
        target: {
          files: [
            {
              name: 'image.jpg'
            }
          ]
        }
      };

      component.onFileChange(event as any);

      expect(component.photoFile).toEqual({
        name: 'image.jpg'
      });
    });
  });

  describe('uploadPhoto', () => {
    beforeEach(() => {
      component.data = { id: 1 } as iProduct;
      component.photoFile = {
        name: 'image.jpg'
      } as File;

      const patchValueMock = jest.fn();
      component.productForm = {
        get: jest.fn().mockReturnValue({
          patchValue: patchValueMock,
          getRawValue: jest.fn(),
        }),
        valid: true,
        _updateTreeValidity: jest.fn(),
        _registerOnCollectionChange: jest.fn(),
      } as unknown as FormGroup;
    });

    it('should call uploadPhoto with the correct arguments', () => {
      const uploadPhotoSpy = jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({}));

      component.uploadPhoto();

      expect(uploadPhotoSpy).toHaveBeenCalledWith(component.photoFile, 1);
    });

    it('should add the imageid to the images array and update the value of the foto form control', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));

      component.uploadPhoto();
      component.act$.subscribe();
      tick();

      expect(component.images).toEqual(['image1.jpg']);
      expect(component.productForm.get('foto')?.patchValue).toHaveBeenCalledWith(['image1.jpg']);
    }));

    it('should call getImage with the correct argument', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));
      const getImageSpy = jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));

      component.uploadPhoto();
      component.act$.subscribe();
      tick();

      expect(getImageSpy).toHaveBeenCalledWith('image1.jpg');
    }));

    it('should call snackBar.open with the correct arguments', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));


      component.uploadPhoto();
      component.act$.subscribe();

      tick();
      expect(snackBarMock.open).toHaveBeenCalledWith('Du musst das Produkt speichern oder die Bilder werden nicht gespeichert mit Produkt...', '', { duration: 2000 });
    }));
  });

  describe('cancelUpload', () => {
    beforeEach(() => {
      component.images = ['image1.jpg', 'image2.jpg'];
      component.getImage = jest.fn();
    });

    it('should call getImage with the last image in the images array', () => {
      component.cancelUpload();

      expect(component.getImage).toHaveBeenCalledWith('image2.jpg');
    });

    it('should call resetFotoUpload', () => {
      component.cancelUpload();

      expect(productServiceMock.resetFotoUpload).toHaveBeenCalled();
    });
  });

  describe('saveProduct', () => {
    beforeEach(() =>
    {
      const patchValueMock = jest.fn();
      component.productForm = {
        get: jest.fn().mockReturnValue({
          patchValue: patchValueMock,
          getRawValue: jest.fn(),
        }),
        valid: true,
        _updateTreeValidity: jest.fn(),
        _registerOnCollectionChange: jest.fn(),
      } as unknown as FormGroup;

    });

    it('should call createProduct if data does not have an id', fakeAsync( () => {
      const createProductSpy = jest.spyOn(productServiceMock, 'createProduct').mockReturnValue(of({} as iProduct));
      const data =  {
        color: "[]",
        currentmenge: undefined,
        foto: "[]",
        id: undefined,
        preis: NaN,

        verkaufteAnzahl: undefined
       } as unknown as iProduct;
      component.data = data;


        fixture.detectChanges();

        component.saveProduct();
        component.create$.subscribe();

        tick();
        expect(productServiceMock.createProduct).toBeCalled();
        expect(createProductSpy).toHaveBeenCalledWith(data);
      }));

    it('should call updateProduct if data has an id', fakeAsync( () => {
      const updateProductSpy = jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(of());
      component.data = {
           color: "[]",
           currentmenge: undefined,
           foto: "[]",
           id: 1,
           preis: NaN,
           verfgbarkeit: false,
           verkaufteAnzahl: undefined
          } as unknown as iProduct;


      fixture.detectChanges();

      component.saveProduct();
      component.create$.subscribe();

      tick();
      expect(productServiceMock.updateProduct).toBeCalled();
      expect(updateProductSpy).toHaveBeenCalledWith(1, {
        color: "[]",
        currentmenge: undefined,
        foto: "[]",
        id: 1,
        preis: NaN,
        verfgbarkeit: false,
        verkaufteAnzahl: undefined
       } as unknown as iProduct);
    }));

    it('should call snackBar.open with the correct arguments when createProduct is successful', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'createProduct').mockReturnValue(of({ id: 1} as unknown as iProduct))


      fixture.detectChanges();

      component.saveProduct();
      component.create$.subscribe();

      tick();
      expect(productServiceMock.createProduct).toBeCalled();

      expect(snackBarMock.open).toHaveBeenCalledWith('Das Produkt wurde hinzugefügt', '', { duration:1500 });
    }));

    it('should call snackBar.open with the correct arguments when createProduct returns an error', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'createProduct').mockReturnValue(of({ id: null} as unknown as iProduct))


      fixture.detectChanges();

      component.saveProduct();
      component.create$.subscribe();

      tick();
      expect(productServiceMock.createProduct).toBeCalled();
      expect(snackBarMock.open).toHaveBeenCalledWith('Etwas ist falschgelaufen, Produkt wurde nicht hinzugefügt', '', { duration: 3000 });
    }));

    it('should call snackBar.open with the correct arguments when updateProduct is successful', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(of({ id: 1 } as unknown as iProduct));
      component.data = { id: 1 } as iProduct;
      const patchValueMock = jest.fn();


      fixture.detectChanges();

      component.saveProduct();
      component.create$.subscribe();

      tick();
      expect(productServiceMock.updateProduct).toBeCalled();
      expect(snackBarMock.open).toHaveBeenCalledWith('Die Änderungen wurden gespeichert', '', { duration: 1500 });
    }));

    it('should call snackBar.open with the correct arguments when updateProduct returns an error', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(of({ id: null } as unknown as iProduct));
      component.data = { id: 1 } as iProduct;


      fixture.detectChanges();

      component.saveProduct();
      component.create$.subscribe();

      tick();
      expect(productServiceMock.updateProduct).toBeCalled();
      expect(snackBarMock.open).toHaveBeenCalledWith('Etwas ist scheifgelaufen, die änderungen wurden nicht gespeichert', '', { duration: 3000 });
    }));
  });

  describe('cancel', () => {
    it('should call dialogRef.close', () => {
      component.cancel();

      expect(dialogRefMock.close).toHaveBeenCalled();
    });
  });

  describe('addColor', () => {
    it('should add a new color to the color array', () => {
      component.color = [] as iColor[];

      component.addColor();

      expect(component.color).toEqual([{ id: 'farbe 01', menge: 0 }]);
    });
  });

  describe('removeColor', () => {
    it('should remove last color from the color array', () => {
      component.color = [
        { id: 'farbe 01', menge: 0 },
        { id: 'farbe 02', menge: 0 }
      ];

      component.removeColor();

      expect(component.color).toEqual([{ id: 'farbe 01', menge: 0 }]);
    });

    it('should not remove any color if the array is empty', () => {
      component.color = [] as iColor[];

      component.removeColor();

      expect(component.color).toEqual([]);
    });
  });

  describe('getImage', () => {
    it('should call getImage with the correct argument', () => {
      const getImageSpy = jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));

      component.getImage('image1.jpg');

      expect(getImageSpy).toHaveBeenCalledWith('image1.jpg');
    });

    it('should set the currentImage property with the result of getImage', fakeAsync( () => {
      jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));

      component.getImage('image1.jpg');
      component.getFoto$.subscribe();
      tick();

      expect(component.currentImage).toEqual({});
    }));
  });

  describe('getSafeImageData', () => {
    it('should return the sanitized image data', () => {
      component.currentImage = {
        data: 'image data'
      } as unknown as Blob;
      sanitizerMock.bypassSecurityTrustResourceUrl = jest.fn().mockReturnValue('sanitized image data');

      const result = component.getSafeImageData();

      expect(result).toEqual('sanitized image data');
      expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(URL.createObjectURL(component.currentImage));
    });

    it('should return an empty string if the currentImage is falsy', () => {
     // component.currentImage = null;

      const result = component.getSafeImageData();

      expect(result).toEqual('');
    });
  });

  describe('getSelected', () => {
    it('should return true if the two objects have the same id', () => {
      const o1 = { id: 1 };
      const o2 = { id: 1 };

      const result = component.getSelected(o1, o2);

      expect(result).toBe(true);
    });

    it('should return false if the two objects have different ids', () => {
      const o1 = { id: 1 };
      const o2 = { id: 2 };

      const result = component.getSelected(o1, o2);

      expect(result).toBe(false);
    });

    it('should return false if either of the objects is falsy', () => {
      const o1 = null;
      const o2 = { id: 1 };

      const result = component.getSelected(o1, o2);

      expect(result).toBe(false);
    });
  });

  describe('deleteImage', () => {
    beforeEach(() => {
      component.data = { id: 1 } as iProduct;
      component.images = ['image1.jpg'];
    });

    it('should call deleteImage with the correct arguments', () => {
      const deleteImageSpy = jest.spyOn(productServiceMock, 'deleteImage').mockReturnValue(of(1));

      component.deleteImage('image1.jpg');

      expect(deleteImageSpy).toHaveBeenCalledWith({ produktid: 1, fileid: 'image1.jpg' });
    });

    it('should remove the imageid from the images array and update the value of the foto form control', fakeAsync( () => {
      const prod: iProduct = { id: 1,  foto: JSON.stringify(['image1.jpg']) } as iProduct;
      component.data = prod;
      fixture.detectChanges();
      jest.spyOn(productServiceMock, 'deleteImage').mockReturnValue(of(1));
      const patchValueMock = jest.fn();
      component.productForm = {
        get: jest.fn().mockReturnValue({
          patchValue: patchValueMock
        })
      } as unknown as FormGroup;

      const item: iDelete =  { produktid: 1, fileid: 'image1.jpg'};
      component.deleteImage('image1.jpg');
      component.act$.subscribe(res => res);
      console.log(component.productForm)
      fixture.detectChanges();
      tick();
      expect(productServiceMock.deleteImage).toBeCalledWith(item);
      expect(component.images).toEqual([]);
      expect(component.productForm.get('foto')?.patchValue).toHaveBeenCalledWith([]);
    }));
  });
});
class MockURL extends global.URL {
  static override createObjectURL = jest.fn();
  static override revokeObjectURL = jest.fn();
}


