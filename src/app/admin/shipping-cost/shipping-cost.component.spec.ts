import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ShippingCostComponent } from './shipping-cost.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShippingCostService } from './shipping-cost.service';
import { environment } from 'src/environments/environment';
import { Input } from '@angular/core';

describe('ShippingCostComponent', () => {
  let component: ShippingCostComponent;
  let fixture: ComponentFixture<ShippingCostComponent>;
  let testController: HttpTestingController;
  const mockShippingCosts = [
    { id: 1, shipping_name: 'Standard', shipping_price: 5, average_material_price: 0.5, cost_per_added_stuck: 1 },
    { id: 2, shipping_name: 'Express', shipping_price: 10, average_material_price: 1, cost_per_added_stuck: 2 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingCostComponent, CommonModule, MatTableModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule,
      HttpClientTestingModule, NoopAnimationsModule],
      providers: [ShippingCostService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingCostComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    const req = testController.expectOne(environment.api+'shipping');
    expect(req.request.method).toEqual('GET');
    req.flush(mockShippingCosts);
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  });

  it('should display a list of shipping costs', () => {

    const req = testController.expectOne(environment.api+'shipping');
    expect(req.request.method).toEqual('GET');
    req.flush(mockShippingCosts);

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(3);
  });

  it('should create a new shipping cost when add button is clicked', () => {
    const req1 = testController.expectOne(environment.api+'shipping');
    expect(req1.request.method).toEqual('GET');
    req1.flush(mockShippingCosts);
    const addButton = fixture.nativeElement.querySelector('.header button');
    addButton.click();

    fixture.detectChanges();

    const req = testController.expectOne(environment.api+'shipping');
    expect(req.request.method).toEqual('POST');
    req.flush({ id: 3, shipping_name: 'New shipping', shipping_price: 0, average_material_price: 0, cost_per_added_stuck: 0 });

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(4); // Assuming the new entry is the only one in the list now
  });

  it('should update an existing shipping cost when update button is clicked', () => {
    const req1 = testController.expectOne(environment.api+'shipping');
    expect(req1.request.method).toEqual('GET');
    req1.flush(mockShippingCosts);
    jest.spyOn(component, 'newOrEditShipping');
    fixture.detectChanges();
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    inputElements[2].value = 6;
    inputElements[2].dispatchEvent(new Event('input'));

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('#update');
    buttons[0].click();
    fixture.detectChanges();
    const updatedShippingCost = { ...mockShippingCosts[0], shipping_price: 6 };
    const req = testController.expectOne(environment.api+'shipping/'+`${mockShippingCosts[0].id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedShippingCost);
    fixture.detectChanges();

    expect(component.newOrEditShipping).toHaveBeenCalledWith(updatedShippingCost);

  });

  it('should delete a shipping cost when delete button is clicked', () => {
    const req1 = testController.expectOne(environment.api+'shipping');
    expect(req1.request.method).toEqual('GET');
    req1.flush(mockShippingCosts);
    jest.spyOn(component, 'deleteShipping');
    fixture.detectChanges();
    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(3);
    const butt = fixture.nativeElement.querySelector('#delete');
    butt.click();
    fixture.detectChanges();
    const req = testController.expectOne(`${environment.api}shipping/${mockShippingCosts[0].id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({ raw: '', affected: 1});

    fixture.detectChanges();
    tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(component.deleteShipping).toHaveBeenCalledTimes(1);

    expect(tableRows.length).toBe(2); // Assuming the list is empty after deletion
  });
});

