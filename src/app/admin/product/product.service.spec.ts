import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { ProductService } from './product.service';
import { iLieferant } from 'src/app/model/iLieferant';
import { iProduct } from 'src/app/model/iProduct';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatSnackBar, ErrorService, HelperService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProduct', () => {
    it('should send a POST request to create a product', () => {

      const product = {
        id: 1,
        name: 'Test Product',
        preis: 10,
        artid: 1,
        beschreibung: 'Test description',
        color: 'red',
        foto: 'test.jpg',
        thumbnail: 'test_thumb.jpg',
        lieferant: {
          // lieferant properties
        } as iLieferant,
        lagerorte: [
          // lagerorte properties
        ],
        bestellungen: [
          // bestellungen properties
        ],
        datumHinzugefuegt: '2021-01-01',
        kategorie: [
          // kategorie properties
        ],
        verfgbarkeit: true,
        mindestmenge: 1,
        currentmenge: 10,
        verkaufteAnzahl: 5,
        wareneingang: [
          // wareneingang properties
        ],
        warenausgang: [
          // warenausgang properties
        ],
        mehrwehrsteuer: 0.19,
        promocje: [
          // promocje properties
        ],
        reservation: [
          // reservation properties
        ],
        bewertung: [
          // bewertung properties
        ]
      };

      service.createProduct(product).subscribe(response => {
        expect(response).toEqual(product);
      });

      const req = httpMock.expectOne(`${service.API}`);
      expect(req.request.method).toBe('POST');
      req.flush(product);
    });

    it('should handle error when creating a product', () => {
      const product = {
        id: 1,
        name: 'Test Product',
        preis: 10,
        artid: 1,
        beschreibung: 'Test description',
        color: 'red',
        foto: 'test.jpg',
        thumbnail: 'test_thumb.jpg',
        lieferant: {
          // lieferant properties
        } as iLieferant,
        lagerorte: [
          // lagerorte properties
        ],
        bestellungen: [
          // bestellungen properties
        ],
        datumHinzugefuegt: '2021-01-01',
        kategorie: [
          // kategorie properties
        ],
        verfgbarkeit: true,
        mindestmenge: 1,
        currentmenge: 10,
        verkaufteAnzahl: 5,
        wareneingang: [
          // wareneingang properties
        ],
        warenausgang: [
          // warenausgang properties
        ],
        mehrwehrsteuer: 0.19,
        promocje: [
          // promocje properties
        ],
        reservation: [
          // reservation properties
        ],
        bewertung: [
          // bewertung properties
        ]
      };

      service.createProduct(product).subscribe({

      error:  error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Fehler beim Erstellen des Produkts.');
        }
    });

      const req = httpMock.expectOne(`${service.API}`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateProduct', () => {
    it('should send a PUT request to update a product', () => {
      const id = 1;
      const product = {
        id: 1,
        name: 'Test Product',
        preis: 10,
        artid: 1,
        beschreibung: 'Test description',
        color: 'red',
        foto: 'test.jpg',
        thumbnail: 'test_thumb.jpg',
        lieferant: {
          // lieferant properties
        } as iLieferant,
        lagerorte: [
          // lagerorte properties
        ],
        bestellungen: [
          // bestellungen properties
        ],
        datumHinzugefuegt: '2021-01-01',
        kategorie: [
          // kategorie properties
        ],
        verfgbarkeit: true,
        mindestmenge: 1,
        currentmenge: 10,
        verkaufteAnzahl: 5,
        wareneingang: [
          // wareneingang properties
        ],
        warenausgang: [
          // warenausgang properties
        ],
        mehrwehrsteuer: 0.19,
        promocje: [
          // promocje properties
        ],
        reservation: [
          // reservation properties
        ],
        bewertung: [
          // bewertung properties
        ]
      };

      service.updateProduct(id, product).subscribe(response => {
        expect(response).toEqual(product);
      });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(product);
    });

    it('should handle error when updating a product', () => {
      const id = 1;
      const product = {
        id: 1,
        name: 'Test Product',
        preis: 10,
        artid: 1,
        beschreibung: 'Test description',
        color: 'red',
        foto: 'test.jpg',
        thumbnail: 'test_thumb.jpg',
        lieferant: {
          // lieferant properties
        } as iLieferant,
        lagerorte: [
          // lagerorte properties
        ],
        bestellungen: [
          // bestellungen properties
        ],
        datumHinzugefuegt: '2021-01-01',
        kategorie: [
          // kategorie properties
        ],
        verfgbarkeit: true,
        mindestmenge: 1,
        currentmenge: 10,
        verkaufteAnzahl: 5,
        wareneingang: [
          // wareneingang properties
        ],
        warenausgang: [
          // warenausgang properties
        ],
        mehrwehrsteuer: 0.19,
        promocje: [
          // promocje properties
        ],
        reservation: [
          // reservation properties
        ],
        bewertung: [
          // bewertung properties
        ]
      };

      service.updateProduct(id, product).subscribe({
       error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Fehler beim Aktualisieren des Produkts.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deleteProduct', () => {
    it('should send a DELETE request to delete a product', () => {
      const id = 1;

      service.deleteProduct(id).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ affected: 1 });
    });

    it('should handle error when deleting a product', () => {
      const id = 1;

      service.deleteProduct(id).subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Fehler beim Löschen des Produkts.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getAllProducts', () => {
    it('should send a GET request to get all products', () => {
      const search = 'null';
      const katid = 1;
      const itemscount = 10;
      const pagenr = 1;

      service.getAllProducts(search, katid, itemscount, pagenr).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service.API}/kunde/${search}/${katid}/${itemscount}/${pagenr}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle error when getting all products ', () => {
      const search = 'null';
      const katid = 1;
      const itemscount = 10;
      const pagenr = 1;
      localStorage.setItem('role', 'ADMIN')
      service.getAllProducts(search, katid, itemscount, pagenr).subscribe( {
         error: error => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Fehler beim Abrufen aller Produkte.');
      }});

      const req = httpMock.expectOne(`${service.API}/${search}/${katid}/${itemscount}/${pagenr}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      localStorage.removeItem('role');
    });
  });

  describe('getProductById', () => {
    it('should send a GET request to get a product by ID', () => {
      const id = 1;

      service.getProductById(id).subscribe(response => {
        expect(response.id).toBe(id);
      });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush({ id: id });
    });

    it('should handle error when getting a product by ID', () => {
      const id = 1;

      service.getProductById(id).subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Fehler beim Abrufen des Produkts nach der ID.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('uploadPhoto', () => {
    it('should send a POST request to upload a photo', () => {
      const file = new File([], 'test.jpg');

      service.uploadPhoto(file).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${service.API}/upload`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should handle error when uploading a photo', () => {
      const file = new File([], 'test.jpg');

      service.uploadPhoto(file).subscribe({

        error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Fehler beim Hochladen des Fotos.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/upload`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getImage', () => {
    it('should send a GET request to get an image', () => {
      const id = '1';

      service.getImage(id).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service.API}/uploads/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(new Blob());
    });

    it('should handle error when getting an image', () => {
      const id = '1';

      service.getImage(id).subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Error retrieving image.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/uploads/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getThumbnails', () => {
    it('should send a GET request to get thumbnails', () => {
      const id = '1';

      service.getThumbnails(id).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service.API}/thumbnails/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(new Blob());
    });

    it('should handle error when getting thumbnails', () => {
      const id = '1';

      service.getThumbnails(id).subscribe({
       error: error => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Error retrieving thumbnails.');
        }
    });

      const req = httpMock.expectOne(`${service.API}/thumbnails/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
