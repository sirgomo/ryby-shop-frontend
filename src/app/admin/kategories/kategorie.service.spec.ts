import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { KategorieService } from './kategorie.service';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { environment } from 'src/environments/environment';

describe('KategorieService', () => {
  let service: KategorieService;
  let httpMock: HttpTestingController;
  let snackbarSpy: jest.MockInstance<MatSnackBarRef<TextOnlySnackBar>, [string, string?, MatSnackBarConfig<any>?]>;
  let errorServiceSpy: jest.SpyInstance;

  beforeEach(() => {
    const snackbarSpyObj = jest.fn();
    const errorServiceSpyObj = jest.spyOn(ErrorService.prototype, 'newMessage').mockImplementation(() => {});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KategorieService,
        { provide: MatSnackBar, useValue: { open: snackbarSpyObj } },
        { provide: ErrorService, useValue: errorServiceSpyObj }
      ]
    });

    service = TestBed.inject(KategorieService);
    httpMock = TestBed.inject(HttpTestingController);
    snackbarSpy = snackbarSpyObj;
    errorServiceSpy = errorServiceSpyObj;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a category', () => {
    const categoryData = { name: 'Category 1' };
    const expectedResponse: iKategorie = { id: 1, parent_id: null, name: 'Category 1', products: [] };

    service.createCategory(categoryData).subscribe((result) => {
      expect(result).toEqual([expectedResponse]);
      expect(snackbarSpy).toHaveBeenCalledWith('Kategorie erstellt', 'ok', { duration: 1000 });
    });

    const req = httpMock.expectOne(`${environment.api}kategorie`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should handle error when creating a category', () => {
    const categoryData = { name: 'Category 1' };
    const errorMessage = 'Error creating category';

    service.createCategory(categoryData).subscribe((result) => {
      expect(result).toEqual([]);
      expect(errorServiceSpy).toHaveBeenCalledWith(errorMessage);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should get a category by id', () => {
    const categoryId = 1;
    const expectedResponse: iKategorie = { id: 1, parent_id: null, name: 'Category 1', products: [] };

    service.getCategoryById(categoryId).subscribe((result) => {
      expect(result).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get all categories', () => {
    const expectedResponse: iKategorie[] = [
      { id: 1, parent_id: null, name: 'Category 1', products: [] },
      { id: 2, parent_id: null, name: 'Category 2', products: [] }
    ];

    service.getAllCategories().subscribe((result) => {
      expect(result).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should handle error when getting all categories', () => {
    const errorMessage = 'Error getting categories';

    service.getAllCategories().subscribe((result) => {
      expect(result).toEqual([]);
      expect(errorServiceSpy).toHaveBeenCalledWith('Es gibt ein error aufgetreten');
    });

    const req = httpMock.expectOne(`${environment.api}kategorie`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should update a category', () => {
    const categoryId = 1;
    const categoryData = { name: 'Updated Category' };
    const expectedResponse: iKategorie = { id: 1, parent_id: null, name: 'Updated Category', products: [] };

    service.updateCategory(categoryId, categoryData).subscribe((result) => {
      expect(result).toEqual([expectedResponse]);
      expect(snackbarSpy).toHaveBeenCalledWith('Kategorie wurde geändert', 'ok', { duration: 1000 });
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  });

  it('should handle error when updating a category', () => {
    const categoryId = 1;
    const categoryData = { name: 'Updated Category' };
    const errorMessage = 'Error updating category';

    service.updateCategory(categoryId, categoryData).subscribe((result) => {
      expect(result).toEqual([]);
      expect(errorServiceSpy).toHaveBeenCalledWith(errorMessage);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should delete a category', () => {
    const categoryId = 1;

    service.deleteCategory(categoryId).subscribe((result) => {
      expect(result).toEqual([]);
      expect(snackbarSpy).toHaveBeenCalledWith('Kategorie wurde gelöscht', 'ok', { duration: 1000 });
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should handle error when deleting a category', () => {
    const categoryId = 1;
    const errorMessage = 'Error deleting category';

    service.deleteCategory(categoryId).subscribe((result) => {
      expect(result).toEqual([]);
      expect(errorServiceSpy).toHaveBeenCalledWith(errorMessage);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should add a product to a category', () => {
    const categoryId = 1;
    const productId = 1;
    const expectedResponse: iKategorie = { id: 1, parent_id: null, name: 'Category 1', products: [] };

    service.addProductToCategory(categoryId, productId).subscribe((result) => {
      expect(result).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1/products/1`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should remove a product from a category', () => {
    const categoryId = 1;
    const productId = 1;
    const expectedResponse: iKategorie = { id: 1, parent_id: null, name: 'Category 1', products: [] };

    service.removeProductFromCategory(categoryId, productId).subscribe((result) => {
      expect(result).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.api}kategorie/1/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(expectedResponse);
  });
});
