import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProtocolComponent } from './add-edit-protocol.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { DestructionProtocolService } from '../destruction-protocol.service';
import { SearchArtikelComponent } from './search-artikel/search-artikel.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { iDestructionProtocol } from 'src/app/model/iDestructionProtocol';


describe('AddEditProtocolComponent', () => {
  let component: AddEditProtocolComponent;
  let fixture: ComponentFixture<AddEditProtocolComponent>;
  let httpMock: HttpTestingController;
  let destructionProtocolService: DestructionProtocolService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        ErrorComponent,
        SearchArtikelComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideMomentDateAdapter(),
        DestructionProtocolService,
        ErrorService,
        HelperService,
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef<AddEditProtocolComponent>,
          useValue: {
            close: jest.fn(),
          }

        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProtocolComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    destructionProtocolService = TestBed.inject(DestructionProtocolService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form and create protocol',async () => {
    component.protocol.patchValue({
      id: null,
      produktId: 1,
      variationId: 1,
      produkt_name: 'Test Product',
      quantity: 10,
      type: 'Type1',
      destruction_date: new Date(),
      responsible_person: 'Person1',
      status: 'Status1',
      description: 'Description'
    });
    const dial = jest.spyOn(component.dialRef, 'close').mockReturnThis();
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.api}destruction-pro`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 1,
      produktId: 1,
      variationId: 1,
      produkt_name: 'Test Product',
      quantity: 10,
      type: 'Type1',
      destruction_date: new Date(),
      responsible_person: 'Person1',
      status: 'Status1',
      description: 'Description'
     });
     fixture.detectChanges();
     await fixture.isStable();
     expect(destructionProtocolService.itemsSig().length).toBe(1);
     expect(destructionProtocolService.itemsSig()[0].produkt_name).toBe('Test Product');
     expect(dial).toHaveBeenCalled();
  });

});
describe('AddEditProtocolComponent with MAT_DIALOG_DATA', () => {
  let component: AddEditProtocolComponent;
  let fixture: ComponentFixture<AddEditProtocolComponent>;
  let httpMock: HttpTestingController;
  let destructionProtocolService: DestructionProtocolService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        ErrorComponent,
        SearchArtikelComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideMomentDateAdapter(),
        DestructionProtocolService,
        ErrorService,
        HelperService,
        { provide: MAT_DIALOG_DATA, useValue: {
          id: 1,
          produktId: 1,
          variationId: '1asdasdg',
          produkt_name: 'Test Product',
          quantity_at_once: 1,
          quantity: 10,
          type: 'Type1',
          destruction_date: new Date(),
          responsible_person: 'Person1',
          status: 'Status1',
          description: 'Description'
        }},
        { provide: MatDialogRef<AddEditProtocolComponent>,
          useValue: {
            close: jest.fn(),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProtocolComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    destructionProtocolService = TestBed.inject(DestructionProtocolService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should submit valid form and edit protocol', async () => {
    const prod: iDestructionProtocol = {
      id: 1,
      produktId: 1,
      variationId: '1asdasdg',
      produkt_name: 'Test Product',
      quantity: 10,
      quantity_at_once: 1,
      type: 'Type1',
      destruction_date: new Date(),
      responsible_person: 'Person1',
      status: 'Status1',
      description: 'Description'
    }

    const dial = jest.spyOn(component.dialRef, 'close').mockReturnThis();

    const req1 = httpMock.expectOne(`${environment.api}destruction-pro/1`);
    expect(req1.request.method).toBe('GET')
    req1.flush(prod);
    fixture.detectChanges();

    await fixture.isStable();
    expect(component.prod()?.id).toBe(1);


    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    expect(buttons.length).toBe(3);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.api}destruction-pro/1`);
    expect(req.request.method).toBe('PUT');
    destructionProtocolService.itemsSig.set([prod]);

    req.flush({
      id: 1,
      produktId: 1,
      variationId: '1asdasdg',
      produkt_name: 'Test Product 2',
      quantity: 10,
      quantity_at_once: 1,
      type: 'Type2',
      destruction_date: new Date(),
      responsible_person: 'Person1',
      status: 'Status1',
      description: 'Description'
     });
     fixture.detectChanges();
     await fixture.isStable();
     expect(destructionProtocolService.itemsSig().length).toBe(1);
     expect(destructionProtocolService.itemsSig()[0].produkt_name).toBe('Test Product 2');
     expect(destructionProtocolService.itemsSig()[0].type).toBe('Type2')
     expect(dial).toHaveBeenCalled();
  });
  it('should fetch protocol by id and populate form',async () => {
    const prod = {
      id: 1,
      produktId: 1,
      variationId: 1,
      produkt_name: 'Test Product',
      quantity: 10,
      quantity_at_once: 10,
      type: 'Type1',
      destruction_date: new Date(),
      responsible_person: 'Person1',
      status: 'Status1',
      description: 'Description'
    };


    const req1 = httpMock.expectOne(`${environment.api}destruction-pro/1`);
    expect(req1.request.method).toBe('GET')
    req1.flush(prod);
    fixture.detectChanges();

    await fixture.isStable();
    expect(component.prod()?.id).toBe(1);


    expect(component.protocol.value.produktId).toBe(1);
    expect(component.protocol.value.produkt_name).toBe('Test Product');
  });
});
