import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { iKategorie } from 'src/app/model/iKategorie';
import { iAktion } from 'src/app/model/iAktion';
import { Signal, WritableSignal, signal } from '@angular/core';
import { iDelete } from 'src/app/model/iDelete';

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
  let formBuilderMock: Partial<FormBuilder>;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn()
    };

    productServiceMock = {
      getProductById: jest.fn().mockReturnValue(of({})),
      uploadPhoto: jest.fn().mockReturnValue(of({})),
      resetFotoUpload: jest.fn(),
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
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

    formBuilderMock = {
      group: jest.fn().mockReturnValue({
        value: jest.fn(),
        get: jest.fn(),
        patchValue: jest.fn()
      })
    };

    await TestBed.configureTestingModule({
      declarations: [AddEditProductComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: LiferantsService, useValue: liferantServiceMock },
        { provide: KategorieService, useValue: kategorieServiceMock },
        { provide: HelperService, useValue: helperServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
        { provide: DatePipe, useValue: dpipeMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductComponent);
    component = fixture.componentInstance;

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

    it('should set the values of the productForm', () => {

      component.data = { id: 1 } as iProduct;
      component.ngOnInit();

      expect(component.productForm.value).toEqual({
        id: 1,
        name: 'Product 1',
        preis: 10,
        artid: 'ABC123',
        beschreibung: 'Product 1 description',
        foto: ['image1.jpg'],
        thumbnail: 'thumbnail.jpg',
        lieferant: {} as iLieferant,
        lagerorte: [],
        bestellungen: [],
        datumHinzugefuegt: Date.now(),
        kategorie: [],
        verfgbarkeit: false,
        mindestmenge: 5,
        currentmenge: 5,
        product_sup_id: 'ABC123',
        verkaufteAnzahl: 0,
        wareneingang: [],
        warenausgang: [],
        mehrwehrsteuer: '',
        promocje: [],
        reservation: [],
        bewertung: []
      });
    });

    it('should call getImage if images array is not empty', () => {
      const getImageSpy = jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));
      component.data = { id: 1 } as iProduct;
      component.images = ['image1.jpg'];

      component.ngOnInit();

      expect(getImageSpy).toHaveBeenCalledWith('image1.jpg');
    });
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
    });

    it('should call uploadPhoto with the correct arguments', () => {
      const uploadPhotoSpy = jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({}));

      component.uploadPhoto();

      expect(uploadPhotoSpy).toHaveBeenCalledWith(component.photoFile, 1);
    });

    it('should add the imageid to the images array and update the value of the foto form control', () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));

      component.uploadPhoto();

      expect(component.images).toEqual(['image1.jpg']);
      expect(component.productForm.get('foto')?.patchValue).toHaveBeenCalledWith(['image1.jpg']);
    });

    it('should call getImage with the correct argument', () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));
      const getImageSpy = jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));

      component.uploadPhoto();

      expect(getImageSpy).toHaveBeenCalledWith('image1.jpg');
    });

    it('should call snackBar.open with the correct arguments', () => {
      jest.spyOn(productServiceMock, 'uploadPhoto').mockReturnValue(of({ imageid: 'image1.jpg' }));

      component.uploadPhoto();

      expect(snackBarMock.open).toHaveBeenCalledWith('Du musst das Produkt speichern oder die Bilder werden nicht gespeichert mit Produkt...', '', { duration: 2000 });
    });
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

      component.productForm.patchValue( {

        name: 'Product 1',
        preis: 10,
        artid: 'ABC123',
        beschreibung: 'Product 1 description',
        foto: ['image1.jpg'],
        thumbnail: 'thumbnail.jpg',
        lieferant: {} as iLieferant,
        lagerorte: [],
        bestellungen: [],
        datumHinzugefuegt: Date.now(),
        kategorie: [],
        verfgbarkeit: false,
        mindestmenge: 5,
        currentmenge: 5,
        product_sup_id: 'ABC123',
        verkaufteAnzahl: 0,
        wareneingang: [],
        warenausgang: [],
        mehrwehrsteuer: '',
        promocje: [],
        reservation: [],
        bewertung: []
      });
      component.data = {} as iProduct;
    });

    it('should call createProduct if data does not have an id', () => {
      const createProductSpy = jest.spyOn(productServiceMock, 'createProduct').mockReturnValue(of({} as iProduct));

      component.saveProduct();

      expect(createProductSpy).toHaveBeenCalledWith(component.productForm.value);
    });

    it('should call updateProduct if data has an id', () => {
      const updateProductSpy = jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(of({} as iProduct));
      component.data = { id: 1 } as iProduct;

      component.saveProduct();

      expect(updateProductSpy).toHaveBeenCalledWith(1, component.productForm.value);
    });

    it('should call snackBar.open with the correct arguments when createProduct is successful', () => {
      jest.spyOn(productServiceMock, 'createProduct').mockReturnValue(of({} as iProduct));

      component.saveProduct();

      expect(snackBarMock.open).toHaveBeenCalledWith('Das Produkt wurde hinzugefügt', '', { duration:1500 });
    });

    it('should call snackBar.open with the correct arguments when createProduct returns an error', () => {
      jest.spyOn(productServiceMock, 'createProduct').mockImplementation(() => {
        return EMPTY;
      })

      component.saveProduct();

      expect(snackBarMock.open).toHaveBeenCalledWith('Etwas ist falschgelaufen, Produkt wurde nicht hinzugefügt', '', { duration: 3000 });
    });

    it('should call snackBar.open with the correct arguments when updateProduct is successful', () => {
      jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(EMPTY);
      component.data = { id: 1 } as iProduct;

      component.saveProduct();

      expect(snackBarMock.open).toHaveBeenCalledWith('Die Änderungen wurden gespeichert', '', { duration: 1500 });
    });

    it('should call snackBar.open with the correct arguments when updateProduct returns an error', () => {
      jest.spyOn(productServiceMock, 'updateProduct').mockReturnValue(EMPTY);
      component.data = { id: 1 } as iProduct;

      component.saveProduct();

      expect(snackBarMock.open).toHaveBeenCalledWith('Etwas ist scheifgelaufen, die änderungen wurden nicht gespeichert', '', { duration: 3000 });
    });
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

    it('should set the currentImage property with the result of getImage', () => {
      jest.spyOn(productServiceMock, 'getImage').mockReturnValue(of({} as Blob));

      component.getImage('image1.jpg');

      expect(component.currentImage).toEqual({});
    });
  });

  describe('getSafeImageData', () => {
    it('should return the sanitized image data', () => {
      component.currentImage = {
        data: 'image data'
      } as unknown as Blob;
      sanitizerMock.bypassSecurityTrustResourceUrl = jest.fn().mockReturnValue('sanitized image data');

      const result = component.getSafeImageData();

      expect(result).toEqual('sanitized image data');
      expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('image data');
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


