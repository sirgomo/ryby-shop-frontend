import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEbayListingsComponent } from './import-ebay-listings.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { EbayInventoryService } from '../ebay-inventory.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';

describe('ImportEbayListingsComponent', () => {
  let component: ImportEbayListingsComponent;
  let fixture: ComponentFixture<ImportEbayListingsComponent>;
  let testController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImportEbayListingsComponent, CommonModule, MatInputModule, FormsModule, MatButtonModule, TextFieldModule, ErrorComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [EbayInventoryService, ErrorService],
    });
    fixture = TestBed.createComponent(ImportEbayListingsComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display error message when error service has a message', () => {
    const errorService = TestBed.inject(ErrorService);
    errorService.newMessage('Test error message');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.err').textContent).toContain('Test error message');
  });

  it('should not display error message when error service has no message', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.err')).toBeNull();
  });

  it('should display success messages when items are successfully added', () => {
    component.succesList.set(['ok, item with id 123 wurde Erfolgreich hinzugefügt\n']);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.added').length).toBe(1);
    expect(compiled.querySelector('.added').textContent).toContain('ok, item with id 123 wurde Erfolgreich hinzugefügt');
  });

  it('should call sendItems and post data through service on button click', () => {
    const inventoryService = TestBed.inject(EbayInventoryService);
    jest.spyOn(inventoryService, 'postListingsString');

    component.items = 'test item asjkhdkashd';
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(inventoryService.postListingsString).toHaveBeenCalledWith('test item asjkhdkashd');
  });

  it('should not call sendItems if items length is less than 10', () => {
    const inventoryService = TestBed.inject(EbayInventoryService);
    jest.spyOn(inventoryService, 'postListingsString');

    component.items = 'short';
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    expect(inventoryService.postListingsString).not.toHaveBeenCalled();
  });

  it('should update textarea value with ngModel', () => {
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea');
    const testValue = 'New value';
    textarea.value = testValue;
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.items).toBe(testValue);
  });
});
