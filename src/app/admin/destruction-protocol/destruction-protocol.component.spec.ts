import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestructionProtocolComponent } from './destruction-protocol.component';
import { DestructionProtocolService } from './destruction-protocol.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AddEditProtocolComponent } from './add-edit-protocol/add-edit-protocol.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Destruction_Protocol_Status, Destruction_Protocol_Type, iDestructionProtocol } from 'src/app/model/iDestructionProtocol';
import { environment } from 'src/environments/environment';
import { By } from '@angular/platform-browser';

describe('DestructionProtocolComponent', () => {
  let httpMock: HttpTestingController;
  let service: DestructionProtocolService;
  let component: DestructionProtocolComponent;
  let fixture: ComponentFixture<DestructionProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestructionProtocolComponent, CommonModule, MatTableModule, MatButtonModule, MatIconModule, AddEditProtocolComponent, MatDialogModule, HttpClientTestingModule],
      providers: [DestructionProtocolService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestructionProtocolComponent);
    service = TestBed.inject(DestructionProtocolService);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    httpMock.verify();
  })
  it('should create', () => {
    expect(component).toBeTruthy();
    const req = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
  it('should gets items from server', () => {
    const mockProtocols: [iDestructionProtocol[], number] = [[{
      id: 1, produkt_name: 'Test Protocol',
      produktId: 23,
      variationId: 'sd23',
      quantity: 1,
      quantity_at_once: 1,
      type: Destruction_Protocol_Type['Beschädigt im Transport'],
      destruction_date: new Date('03/05/2024'),
      responsible_person: 'war',
      status: Destruction_Protocol_Status.CLOSED,
      description: 'nie ma'
    }], 1];


    const req = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProtocols);

    fixture.detectChanges();


    expect(component.data().length).toBe(1);
    expect(component.data()[0].produkt_name).toEqual('Test Protocol');
    expect(component.data()[0].id).toEqual(1);
    expect(component.data()[0].produktId).toEqual(23);
    expect(component.data()[0].variationId).toEqual('sd23');
    expect(component.data()[0].quantity).toEqual(1);
    expect(component.data()[0].quantity_at_once).toEqual(1);
    expect(component.data()[0].type).toEqual('Beschädigt im Transport');
    expect(component.data()[0].destruction_date).toEqual(new Date('03/05/2024'));
    expect(component.data()[0].responsible_person).toEqual('war');
    expect(component.data()[0].status).toEqual('CLOSED');
    expect(component.data()[0].description).toEqual('nie ma');
  })
  it('should delete item',async () => {
    const mockProtocols: [iDestructionProtocol[], number] = [[{
      id: 1, produkt_name: 'Test Protocol',
      produktId: 23,
      variationId: 'sd23',
      quantity: 1,
      quantity_at_once: 1,
      type: Destruction_Protocol_Type['Beschädigt im Transport'],
      destruction_date: new Date('03/05/2024'),
      responsible_person: 'war',
      status: Destruction_Protocol_Status.CLOSED,
      description: 'nie ma'
    }], 1];


    const req = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProtocols);

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    const reqd = httpMock.expectOne(`${environment.api}destruction-pro/1`);
    expect(reqd.request.method).toBe('DELETE');
    reqd.flush({affected: 1, raw: ''});

    fixture.detectChanges();
    await fixture.isStable()

    const reqAfterDelete = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(reqAfterDelete.request.method).toBe('GET');
    if (!reqAfterDelete.cancelled) {
      reqAfterDelete.flush([]);
    }

    const buttonsNow = fixture.nativeElement.querySelectorAll('button');

    expect(buttonsNow.length).toBe(1);
    expect(component.data().length).toBe(0);


  })
});
