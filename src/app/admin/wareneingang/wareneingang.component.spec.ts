import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WareneingangService } from './wareneingang.service';
import { WareneingangComponent } from './wareneingang.component';
import { ErrorService } from 'src/app/error/error.service';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { AddEditBuchungComponent } from './add-edit-buchung/add-edit-buchung.component';
import { signal } from '@angular/core';
import { iLieferant } from 'src/app/model/iLieferant';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { iLager } from 'src/app/model/iLager';

describe('WareneingangComponent', () => {
  let component: WareneingangComponent;
  let fixture: ComponentFixture<WareneingangComponent>;
  let mockWareneingangService: Partial<WareneingangService>;
  let mockErrorService: Partial<ErrorService>;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    mockWareneingangService = {
      warenEingangSig: signal<iWarenEingang[]>([]),
      deleteWareneingangBuchung: jest.fn().mockReturnValue(of({ affected: 1, raw: '' })),
    };

    mockErrorService = {
      message: signal<string>(''),
    };

    TestBed.configureTestingModule({
      imports: [WareneingangComponent, AddEditBuchungComponent, MatDialogModule, HttpClientTestingModule, MatTableModule, MatIconModule, MatTabsModule, MatCheckboxModule, MatDatepickerModule, MatInputModule, MatFormFieldModule,
      MatMomentDateModule, MatSelectModule, ],
      providers: [
        { provide: WareneingangService, useValue: mockWareneingangService },
        { provide: ErrorService, useValue: mockErrorService },
        { provide: MatSnackBar, useValue: {
          open: jest.fn(),
        }}
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WareneingangComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog to create new goods receipt', () => {
    const dialogOpenSpy = jest.spyOn(dialog, 'open');

    component.newOrEditGoodsReceipt();

    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('should open dialog to edit existing goods receipt', () => {
    const dialogOpenSpy = jest.spyOn(dialog, 'open');
    const goodsReceipt: iWarenEingang = {
      id: 1, products: [], lieferant: { name: 'piwo' } as iLieferant, empfangsdatum: '', rechnung: '', lieferscheinNr: '', datenEingabe: '', gebucht: false, eingelagert: false,
      shipping_cost: 0,
      remarks: '',
      other_cost: 0,
      location: {} as iLager,
      wahrung: '',
      wahrung2: '',
      wahrung_rate: 0,
      shipping_cost_eur: 0,
      other_cost_eur: 0
    };

    component.newOrEditGoodsReceipt(goodsReceipt);

    expect(dialogOpenSpy).toHaveBeenCalledWith(AddEditBuchungComponent, expect.objectContaining({ data: goodsReceipt }));
  });

  it('should delete goods receipt when delete button is clicked', () => {
    const goodsReceiptId = 1;
    const deleteGoodsReceiptSpy = jest.spyOn(component, 'deleteGoodsReceipt');

    component.deleteGoodsReceipt(goodsReceiptId);

    expect(deleteGoodsReceiptSpy).toHaveBeenCalledWith(goodsReceiptId);
  });
});
