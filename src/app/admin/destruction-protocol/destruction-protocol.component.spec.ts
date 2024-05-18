import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestructionProtocolComponent } from './destruction-protocol.component';
import { DestructionProtocolService } from './destruction-protocol.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AddEditProtocolComponent } from './add-edit-protocol/add-edit-protocol.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Destruction_Protocol_Status, Destruction_Protocol_Type, iDestructionProtocol } from 'src/app/model/iDestructionProtocol';
import { environment } from 'src/environments/environment';
import { DialogConfig } from '@angular/cdk/dialog';
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
  it('should open add eddit fenster with no data', () => {
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

    const dial = jest.spyOn(component.dialo, 'open').mockReturnThis();

    const req = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProtocols);

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    fixture.detectChanges();
    expect(buttons.length).toBe(2);
    expect(dial).toHaveBeenCalledTimes(1);
    expect(dial).toHaveBeenCalledWith(AddEditProtocolComponent,  {"ariaDescribedBy": null, "ariaLabel": null, "ariaLabelledBy": null, "ariaModal": true, "autoFocus": "first-tabbable", "backdropClass": "", "closeOnNavigation": true, "data": null, "delayFocusTrap": true, "disableClose": false, "hasBackdrop": true, "height": "80%", "panelClass": "", "restoreFocus": true, "role": "dialog", "width": "50%"});

  })
  it('should open add eddit fenster with data',() => {
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
    const dial = jest.spyOn(component.dialo, 'open').mockImplementation();


    const req = httpMock.expectOne(`${environment.api}destruction-pro?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProtocols);

    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('#edit'));
    buttons[0].nativeElement.click();

    fixture.detectChanges();

    expect(buttons.length).toBe(1);


    expect(dial).toHaveBeenCalledTimes(1);
    expect(dial).toHaveBeenCalledWith(AddEditProtocolComponent,  {"ariaDescribedBy": null, "ariaLabel": null, "ariaLabelledBy": null, "ariaModal": true, "autoFocus": "first-tabbable", "backdropClass": "", "closeOnNavigation": true, "data": mockProtocols[0][0], "delayFocusTrap": true, "disableClose": false, "hasBackdrop": true, "height": "80%", "panelClass": "", "restoreFocus": true, "role": "dialog", "width": "50%"});

  })
});
