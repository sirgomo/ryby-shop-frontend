import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LiferantsService } from './liferants.service';
import { iLieferant } from 'src/app/model/iLieferant';

describe('LiferantsService', () => {
  let service: LiferantsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LiferantsService]
    });
    service = TestBed.inject(LiferantsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllLieferanten', () => {
    it('should return an Observable<iLieferant[]>', () => {
      const dummyLieferanten: iLieferant[] = [
        { id: 1, name: 'Lieferant 1', email: 'lieferant1@test.com', telefon: '1234567890', adresse: { strasse: 'Street 1', hausnummer: '123', stadt: 'City 1', postleitzahl: '12345', land: 'Country 1' }, steuernummer: '1234567890', bankkontonummer: '1234567890', ansprechpartner: 'Ansprechpartner 1', zahlart: 'Zahlart 1', umsatzsteuerIdentifikationsnummer: '1234567890' },
        { id: 2, name: 'Lieferant 2', email: 'lieferant2@test.com', telefon: '0987654321', adresse: { strasse: 'Street 2', hausnummer: '456', stadt: 'City 2', postleitzahl: '54321', land: 'Country 2' }, steuernummer: '0987654321', bankkontonummer: '0987654321', ansprechpartner: 'Ansprechpartner 2', zahlart: 'Zahlart 2', umsatzsteuerIdentifikationsnummer: '0987654321' }
      ];

      service.getAllLieferanten().subscribe(lieferanten => {
        expect(lieferanten.length).toBe(2);
        expect(lieferanten).toEqual(dummyLieferanten);
      });

      const request = httpMock.expectOne(service.api);
      expect(request.request.method).toBe('GET');
      request.flush(dummyLieferanten);
    });

    it('should return an empty array if the request fails', () => {
      service.getAllLieferanten().subscribe(lieferanten => {
        expect(lieferanten.length).toBe(0);
      });

      const request = httpMock.expectOne(service.api);
      expect(request.request.method).toBe('GET');
      request.error(new ErrorEvent('error'));
    });
  });

  describe('getLieferantById', () => {
    it('should return an Observable<iLieferant>', () => {
      const dummyLieferant: iLieferant = { id: 1, name: 'Lieferant 1', email: 'lieferant1@test.com', telefon: '1234567890', adresse: { strasse: 'Street 1', hausnummer: '123', stadt: 'City 1', postleitzahl: '12345', land: 'Country 1' }, steuernummer: '1234567890', bankkontonummer: '1234567890', ansprechpartner: 'Ansprechpartner 1', zahlart: 'Zahlart 1', umsatzsteuerIdentifikationsnummer: '1234567890' };

      service.getLieferantById(1).subscribe(lieferant => {
        expect(lieferant).toEqual(dummyLieferant);
      });

      const request = httpMock.expectOne(`${service.api}/1`);
      expect(request.request.method).toBe('GET');
      request.flush(dummyLieferant);
    });
  });

  describe('createLieferant', () => {
    it('should return an Observable<iLieferant>', () => {
      const dummyLieferant: iLieferant = { id: 1, name: 'Lieferant 1', email: 'lieferant1@test.com', telefon: '1234567890', adresse: { strasse: 'Street 1', hausnummer: '123', stadt: 'City 1', postleitzahl: '12345', land: 'Country 1' }, steuernummer: '1234567890', bankkontonummer: '1234567890', ansprechpartner: 'Ansprechpartner 1', zahlart: 'Zahlart 1', umsatzsteuerIdentifikationsnummer: '1234567890' };

      service.createLieferant(dummyLieferant).subscribe(lieferant => {
        expect(lieferant).toEqual(dummyLieferant);
      });

      const request = httpMock.expectOne(service.api);
      expect(request.request.method).toBe('POST');
      request.flush(dummyLieferant);
    });
  });

  describe('updateLieferant', () => {
    it('should return an Observable<iLieferant>', () => {
      const dummyLieferant: iLieferant = { id: 1, name: 'Lieferant 1', email: 'lieferant1@test.com', telefon: '1234567890', adresse: { strasse: 'Street 1', hausnummer: '123', stadt: 'City 1', postleitzahl: '12345', land: 'Country 1' }, steuernummer: '1234567890', bankkontonummer: '1234567890', ansprechpartner: 'Ansprechpartner 1', zahlart: 'Zahlart 1', umsatzsteuerIdentifikationsnummer: '1234567890' };

      service.updateLieferant(dummyLieferant).subscribe(lieferant => {
        expect(lieferant).toEqual(dummyLieferant);
      });

      const request = httpMock.expectOne(service.api);
      expect(request.request.method).toBe('PUT');
      request.flush(dummyLieferant);
    });
  });

  describe('deleteLieferant', () => {
    it('should return an Observable<number> with 1 if the delete operation is successful', () => {
      service.deleteLieferant(1).subscribe(result => {
        expect(result).toBe(1);
      });

      const request = httpMock.expectOne(`${service.api}/1`);
      expect(request.request.method).toBe('DELETE');
      request.flush(1);
    });

    it('should return an Observable<number> with 0 if the delete operation fails', () => {
      service.deleteLieferant(1).subscribe(result => {
        expect(result).toBe(0);
      });

      const request = httpMock.expectOne(`${service.api}/1`);
      expect(request.request.method).toBe('DELETE');
      request.error(new ErrorEvent('error'));
    });
  });
});
