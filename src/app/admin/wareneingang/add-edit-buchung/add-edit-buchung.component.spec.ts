import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { LiferantsService } from '../../liferants/liferants.service';
import { WareneingangService } from '../wareneingang.service';
import { AddEditBuchungComponent } from './add-edit-buchung.component';
import { iLieferant } from 'src/app/model/iLieferant';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { Component, signal } from '@angular/core';

describe('AddEditBuchungComponent', () => {
  let component: AddEditBuchungComponent;
  let fixture: ComponentFixture<AddEditBuchungComponent>;
  let mockDialogRef: Partial<MatDialogRef<AddEditBuchungComponent>>;
  let mockWareneingangService: Partial<WareneingangService>;
  let mockErrorService: Partial<ErrorService>;
  let mockLiferantsService: Partial<LiferantsService>;
  let mockSnackBar: Partial<MatSnackBar>;

  beforeEach(waitForAsync( () => {

    mockErrorService = {
      newMessage: jest.fn()
    };
    mockDialogRef = {
      close: jest.fn(),
    }

    mockLiferantsService = {
      liferants$: of([{ id: 1, name: 'Liferant 1' } as iLieferant])
    };

    mockSnackBar = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, HttpClientTestingModule, MatFormFieldModule,
        MatInputModule, MatDatepickerModule, MatMomentDateModule, MatSelectModule, MatCheckboxModule, MatTabsModule],
      declarations: [AddEditBuchungComponent, FakeAppList],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
         WareneingangService,
       ErrorService,
        { provide: LiferantsService, useValue: mockLiferantsService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents()
    .then(() => {
    fixture = TestBed.createComponent(AddEditBuchungComponent);
    mockWareneingangService = TestBed.inject(WareneingangService);
    mockErrorService = TestBed.inject(ErrorService);
    mockErrorService.message = signal<string>('');
    component = fixture.componentInstance;
    fixture.detectChanges();
  })}));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeGoodsReceipt method', () => {
    component.closeGoodsReceipt();
    jest.spyOn(mockDialogRef, 'close').mockImplementation();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call onSelectionChange method', () => {
    component.onSelectionChange(1);

    if(mockWareneingangService.lieferantIdSig)
    expect(mockWareneingangService.lieferantIdSig()).toBe(1);
  });

  it('should call saveGoodsReceipt method when warenEingangForm is valid', () => {
    component.warenEingangForm.setValue({
      id: null,
      lieferant: 1,
      empfangsdatum: new Date(),
      rechnung: '123',
      lieferscheinNr: '456',
      datenEingabe: new Date(),
      gebucht: true,
      eingelagert: false
    });
    jest.spyOn(mockWareneingangService, 'createWareneingangBuchung').mockReturnValue(of({  id: 1,
      lieferant: { id: 1 } as iLieferant ,
      products: [],
      empfangsdatum: new Date().toISOString(),
      rechnung: '123',
      lieferscheinNr: '456',
      datenEingabe: new Date().toISOString(),
      gebucht: true,
      eingelagert: false}));
      jest.spyOn(mockSnackBar, 'open').mockImplementation();
    component.saveGoodsReceipt();
    component.act$.subscribe();
    fixture.detectChanges();
    component.saveGoodsReceipt();
    expect(mockWareneingangService.createWareneingangBuchung).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Die buchung wurde gespeichert', ' Ok', { duration: 3000 });
  });

  it('should call saveGoodsReceipt method when warenEingangForm is valid and data is not null', () => {
    component.data = { id: 1 } as iWarenEingang;
    component.warenEingangForm.setValue({
      id: 1,
      lieferant: 1,
      empfangsdatum: new Date(),
      rechnung: '123',
      lieferscheinNr: '456',
      datenEingabe: new Date(),
      gebucht: true,
      eingelagert: false
    });
    jest.spyOn(mockWareneingangService, 'updateWareneingangBuchung').mockReturnValue(of({  id: 1,
      lieferant: { id: 1 } as iLieferant ,
      products: [],
      empfangsdatum: new Date().toISOString(),
      rechnung: '123',
      lieferscheinNr: '456',
      datenEingabe: new Date().toISOString(),
      gebucht: true,
      eingelagert: false}));
      jest.spyOn(mockSnackBar, 'open').mockImplementation();
    component.saveGoodsReceipt();
    component.act$.subscribe();
    fixture.detectChanges();
    expect(mockWareneingangService.updateWareneingangBuchung).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Die buchung wurde gespeichert', ' Ok', { duration: 3000 });
  });

  it('should display a warning message when data is null', () => {

    fixture.detectChanges();
    const warningMessage = fixture.nativeElement.querySelector('.info-warn');
    expect(warningMessage.textContent).toContain('Du solltest zuerst die Buchung speichern!');
  });
});
@Component({
  selector: 'app-artikel-list',
  template: ''
})
class FakeAppList {}
