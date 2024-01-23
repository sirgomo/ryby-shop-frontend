import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WarehouseComponent } from './warehouse.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorComponent } from 'src/app/error/error.component';
import { WarehouseService } from './warehouse.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { iLager } from 'src/app/model/iLager';
import { By } from '@angular/platform-browser';
import { AddEditWarehouseComponent } from './add-edit-warehouse/add-edit-warehouse.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatDialog } from '@angular/material/dialog';

describe('WarehouseComponent', () => {
  let component: WarehouseComponent;
  let fixture: ComponentFixture<WarehouseComponent>;
  let testController: HttpTestingController;
  let error: ErrorService;
  const lager:iLager = {
    id: 23,
    name: 'koso',
    lagerorte: [],
    adresse: 'irgendwo'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WarehouseComponent, CommonModule, MatButtonModule, MatIconModule, ErrorComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [WarehouseService, ErrorService, {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        }
      }],
    });
    fixture = TestBed.createComponent(WarehouseComponent);
    component = fixture.componentInstance;
    error = TestBed.inject(ErrorService);
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager]);
    expect(component).toBeTruthy();
  });
  it('should display loader when warehouses are not loaded',fakeAsync( () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager]);
    tick(500);
    const loaderElement = fixture.debugElement.query(By.css('#loader')).nativeElement;
    expect(loaderElement).toBeTruthy();
  }));

  it('should display error component when there is an error message', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager]);
    error.newMessage('Error message');
    fixture.detectChanges();

    const errorMEssage = fixture.nativeElement.querySelector('.error p');
    expect(errorMEssage.textContent).toBe('Error message');
  });

  it('should not display error component when there is no error message', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager]);
    fixture.detectChanges();
    const errorComponent = fixture.debugElement.query(By.directive(ErrorComponent));
    expect(errorComponent).toBeFalsy();
  });

  it('should call newWarehaouseOrEdit() method when add button is clicked', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager]);
    jest.spyOn(component, 'newWarehaouseOrEdit');
    jest.spyOn(component.dialog, 'open');
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('#newWarehaouse'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.newWarehaouseOrEdit).toHaveBeenCalledWith();
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
  });

  it('should call delete() method when delete button is clicked',  () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager, { id: 1, name: 'Test Warehouse', lagerorte: [], adresse: 'Test Address' }]);

    fixture.detectChanges();
    jest.spyOn(component, 'delete');
    const deleteButton = fixture.debugElement.query(By.css('#delbutton')).nativeElement;
    deleteButton.click();

    fixture.detectChanges();

    expect(component.delete).toHaveBeenCalledWith(component.warehousesSig()![0]);
    const requ2 = testController.expectOne(environment.api + 'lager/'+component.warehousesSig()![0].id);
    expect(requ2.request.method).toBe('DELETE');
    requ2.flush({raw: '', affected: 1 });
  });

  it('should display the correct number of rows for warehouses',fakeAsync( () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager, { id: 1, name: 'Test Warehouse', lagerorte: [], adresse: 'Test Address' }]);

    tick();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.row');
    console.log(rows)
    // Subtract 1 for the header row
    expect(rows.length - 1).toBe(component.warehousesSig()!.length);
  }));

  it('should display "0" when lagerorte is not available or empty', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    requ.flush([lager, { id: 1, name: 'Test Warehouse', lagerorte: [], adresse: 'Test Address' }]);

    fixture.detectChanges();
    const lagerorteCount = fixture.debugElement.queryAll(By.css('.row .item:nth-child(3)'))[1];
    expect(lagerorteCount.nativeElement.textContent).toContain('0');
  });


  it('should open AddEditWarehouseComponent dialog with correct data when editing a warehouse', () => {
    const requ = testController.expectOne(environment.api + 'lager');
    expect(requ.request.method).toBe('GET');
    requ.flush([lager, { id: 1, name: 'Test Warehouse', lagerorte: [], adresse: 'Test Address' }]);
    fixture.detectChanges();


    jest.spyOn(component.dialog, 'open');
    const editButton = fixture.debugElement.query(By.css('#edit'));
    editButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.dialog.open).toHaveBeenCalledWith(AddEditWarehouseComponent, expect.anything());
  });
});
