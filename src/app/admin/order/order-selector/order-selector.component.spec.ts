import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSelectorComponent } from './order-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BESTELLUNGSSTATUS, BESTELLUNGSSTATE } from 'src/app/model/iBestellung';
import { By } from '@angular/platform-browser';

describe('OrderSelectorComponent', () => {
  let component: OrderSelectorComponent;
  let fixture: ComponentFixture<OrderSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderSelectorComponent, MatFormFieldModule, MatSelectModule, FormsModule, CommonModule, HttpClientTestingModule, NoopAnimationsModule],

    });
    fixture = TestBed.createComponent(OrderSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update currentStatus when changeStatus is called', () => {
    const newStatus = BESTELLUNGSSTATUS.VERSCHICKT;
    component.currentStatus = newStatus;
    component.changeStatus();
    expect(component.currentStatus).toBe(newStatus);
  });

  it('should update currentState when changeState is called', () => {
    const newState = BESTELLUNGSSTATE.ABGEBROCHEN;
    component.currentState = newState;
    component.changeState();
    expect(component.currentState).toBe(newState);
  });

  it('should update currentItemProSite when changeItemQuanity is called', () => {
    const newItemProSite = 20;
    component.currentItemProSite = newItemProSite;
    component.changeItemQuanity();
    expect(component.currentItemProSite).toBe(newItemProSite);
  });

  it('should call changeStatus when status select option is changed', () => {
    jest.spyOn(component, 'changeStatus');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#currentStatus');
    select.dispatchEvent(new Event('selectionChange'));
    fixture.detectChanges();
    expect(component.changeStatus).toHaveBeenCalled();
  });

  it('should call changeState when state select option is changed', () => {
    jest.spyOn(component, 'changeState');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#currentState');
    select.dispatchEvent(new Event('selectionChange'));
    fixture.detectChanges();
    expect(component.changeState).toHaveBeenCalled();
  });

  it('should call changeItemQuanity when items per page select option is changed', () => {
    jest.spyOn(component, 'changeItemQuanity');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#currentItemProSite');
    select.dispatchEvent(new Event('selectionChange'));
    fixture.detectChanges();
    expect(component.changeItemQuanity).toHaveBeenCalled();
  });

  it('should correctly render the status options', () => {
    fixture.detectChanges();
    const select: HTMLElement = fixture.nativeElement.querySelector('#currentStatus');
    select.click();
    fixture.detectChanges();
    const options: NodeListOf<HTMLElement> = document.querySelectorAll('mat-option');
    expect(options.length).toEqual(component.statusArr.length);
  });

  it('should correctly render the state options', () => {
    const select: HTMLElement = fixture.nativeElement.querySelector('#currentState');
    select.click();
    fixture.detectChanges();
    const options: NodeListOf<HTMLElement> = document.querySelectorAll('mat-option');
    expect(options.length).toEqual(component.stateArr.length);
  });

  it('should correctly render the items per page options', () => {
    const select: HTMLElement = fixture.nativeElement.querySelector('#currentItemProSite');
    select.click();
    fixture.detectChanges();
    const options: NodeListOf<HTMLElement> = document.querySelectorAll('mat-option');
    expect(options.length).toEqual(component.siteItems.length);
  });
});
