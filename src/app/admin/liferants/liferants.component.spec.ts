import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { iLieferant } from 'src/app/model/iLieferant';
import { AddEditLiferantComponent } from '../add-edit-liferant/add-edit-liferant.component';
import { LiferantsComponent } from './liferants.component';
import { LiferantsService } from './liferants.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('LiferantsComponent', () => {
  let component: LiferantsComponent;
  let fixture: ComponentFixture<LiferantsComponent>;
  let liferantsService: LiferantsService;
  let dialog: MatDialog;
  let liferantsSubject: BehaviorSubject<iLieferant[]>;

  beforeEach(async () => {
    liferantsSubject = new BehaviorSubject<iLieferant[]>([]);

    await TestBed.configureTestingModule({
      imports: [LiferantsComponent, MatTableModule, MatIconModule, MatCardModule],
      providers: [
        {
          provide: LiferantsService,
          useValue: {
            liferants$: liferantsSubject.asObservable(),
            deleteLieferant: jest.fn().mockReturnValue(of(1))
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiferantsComponent);
    component = fixture.componentInstance;
    liferantsService = TestBed.inject(LiferantsService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open AddEditLiferant dialog when addEditLiferant method is called without parameter', () => {
    const spy = jest.spyOn(dialog, 'open');
    component.addEditLiferant();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe(AddEditLiferantComponent);
    if(spy.mock.calls[0][1])
    expect(spy.mock.calls[0][1].data).toBeNull();
  });

  it('should open AddEditLiferant dialog when addEditLiferant method is called with a lieferant parameter', () => {
    const spy = jest.spyOn(dialog, 'open');
    const lieferant: iLieferant = {
      id: 1, name: 'Test Lieferant', email: 'test@test.com',
      telefon: '',
      adresse: {
        strasse: '',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    component.addEditLiferant(lieferant);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe(AddEditLiferantComponent);
    if(spy.mock.calls[0][1])
    expect(spy.mock.calls[0][1].data).toBe(lieferant);
  });

  it('should call deleteLieferant method of LiferantsService when deleteLieferant method is called', () => {
    const spy = jest.spyOn(liferantsService, 'deleteLieferant');
    const lieferantId = 1;
    component.deleteLieferant(lieferantId);
    expect(spy).toHaveBeenCalledWith(lieferantId);
  });

  it('should update liferanten$ when deleteLieferant method is called', () => {
    const lieferant: iLieferant = {
      id: 1, name: 'Test Lieferant', email: 'test@test.com',
      telefon: '',
      adresse: {
        strasse: '',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    const liferants: iLieferant[] = [lieferant];
    liferantsSubject.next(liferants); // Manually emit the updated value
    const lieferantId = 1;
    component.deleteLieferant(lieferantId);
    component.lieferanten$.subscribe(res => {
      expect(res).toEqual([]);
    });
  });

  it('should display the correct number of table rows based on the number of liferants', fakeAsync( () => {
    const lieferant: iLieferant = {
      id: 1, name: 'Test Lieferant', email: 'test@test.com',
      telefon: '',
      adresse: {
        strasse: '',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    const lieferant1: iLieferant = {
      id: 1, name: 'Test Lieferant', email: 'test@test.com',
      telefon: '',
      adresse: {
        strasse: '',
        hausnummer: '',
        stadt: '',
        postleitzahl: '',
        land: ''
      },
      steuernummer: '',
      bankkontonummer: '',
      ansprechpartner: '',
      zahlart: '',
      umsatzsteuerIdentifikationsnummer: ''
    };
    const liferants: iLieferant[] = [
      lieferant,
      lieferant1,
    ];
    component.lieferanten$ = liferantsSubject.asObservable();
    liferantsSubject.next([]);
    fixture.detectChanges();
    liferantsSubject.next(liferants);


    tick();
    fixture.detectChanges();
    const tableRows = fixture.debugElement.queryAll(By.css('tr'));

    expect(tableRows.length-1).toBe(liferants.length);
  }));

});
