import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayComponent } from './ebay.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ErrorComponent } from '../error/error.component';
import { InoviceComponent } from '../inovice/inovice.component';
import { EbayTransactionsComponent } from './ebay-transactions/ebay-transactions.component';
import { RefundComponent } from './refund/refund.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

describe('EbayComponent', () => {
  let component: EbayComponent;
  let fixture: ComponentFixture<EbayComponent>;
  let testController: HttpTestingController;

  beforeEach(() => {
    window.open = jest.fn();
    TestBed.configureTestingModule({
      imports: [EbayComponent, CommonModule, FormsModule, MatTableModule, InoviceComponent, MatDialogModule, MatButtonModule,
         MatIconModule, EbayTransactionsComponent, ErrorComponent, RefundComponent, HttpClientTestingModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(EbayComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    testController.verify();
  })
  it('should create', () => {
    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);
    expect(component).toBeTruthy();
  });
  it('not logged, show login div to ebay and get consent link', ()=> {
    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);
    const contDiv = fixture.debugElement.query(By.css('.content'));
    expect(contDiv).toBeDefined();
  });
  it('should click getLink for ebay Login', ()=> {

    const wind = jest.spyOn(window, 'open').mockImplementationOnce(() => {
      component.show_input = true;
      return null;
    });

    const requ = testController.expectOne(environment.api+'ebay');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);

    const contDiv = fixture.debugElement.query(By.css('.content'));
    expect(contDiv).toBeDefined();
     const getLink = jest.spyOn(component, 'getLink');
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    expect(getLink).toHaveBeenCalledTimes(1);
    const req = testController.expectOne(environment.api + 'ebay'+'/consent');
    expect(req.request.method).toBe('GET');
    req.flush('address');


    expect(wind).toHaveBeenCalled();
    expect(component.show_input).toBeTruthy();
  })
});
