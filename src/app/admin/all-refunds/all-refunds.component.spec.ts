import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRefundsComponent } from './all-refunds.component';
import { ShowEbayRefundsComponent } from './show-ebay-refunds/show-ebay-refunds.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorComponent } from 'src/app/error/error.component';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ProductsQuanitySelectorComponent } from 'src/app/products/products-quanity-selector/products-quanity-selector.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';
import { MatDialog } from '@angular/material/dialog';

describe('AllRefundsComponent', () => {
  let component: AllRefundsComponent;
  let fixture: ComponentFixture<AllRefundsComponent>;
  let testControll: HttpTestingController;
  let returns: iProduktRueckgabe[];

  beforeEach(async () => {
    setDataTest();
    await TestBed.configureTestingModule({
      imports: [AllRefundsComponent, CommonModule, MatTabsModule, MatTableModule, ErrorComponent, PaginatorComponent,
         ProductsQuanitySelectorComponent, MatButtonModule, MatIconModule, ShowEbayRefundsComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
      MatDialog,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRefundsComponent);
    component = fixture.componentInstance;
    testControll = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    testControll.verify();
  })
  it('should create', () => {
    const requ = testControll.expectOne(environment.api + 'shop-refund/null/10/1');
    expect(requ.request.method).toBe('GET');
   requ.flush(returns);

    expect(component).toBeTruthy();
  });
  it('should display one artikel', () => {
    const requ = testControll.expectOne(environment.api + 'shop-refund/null/10/1');
    expect(requ.request.method).toBe('GET');
   requ.flush([returns, 1]);
    fixture.detectChanges();
    const tabRow = fixture.nativeElement.querySelectorAll('tr');
    expect(tabRow.length).toBe(2);
  });
  it('should click delete and make request to delete item',async () => {
    jest.spyOn(component, 'delete');
    const requ = testControll.expectOne(environment.api + 'shop-refund/null/10/1');
    expect(requ.request.method).toBe('GET');
    requ.flush([returns, 1]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('#delete');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.delete).toHaveBeenCalledWith({
      id: 1,
      bestellung: {} as iBestellung,
      produkte: [],
      kunde: {} as iUserData,
      rueckgabegrund: 'any ground',
      rueckgabestatus: '',
      amount: 1,
      paypal_refund_id: 'hasg27',
      paypal_refund_status: '',
      corrective_refund_nr: 0,
      is_corrective: 0
    });
    const delRequ = testControll.expectOne(environment.api+'shop-refund/1');
    expect(delRequ.request.method).toBe('DELETE');
    delRequ.flush({affected: 1, any: 'dupa'});
  });
  it('should click add corectur for item and open new dialog',async () => {
    jest.spyOn(component, 'add_correctur');
    jest.spyOn(component.dialog, 'open');
    const requ = testControll.expectOne(environment.api + 'shop-refund/null/10/1');
    expect(requ.request.method).toBe('GET');
    requ.flush([returns, 1]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('#corB');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.add_correctur).toHaveBeenCalledWith({
      id: 1,
      bestellung: { refunds: [expect.anything()] } as iBestellung,
      produkte: [],
      kunde: {} as iUserData,
      rueckgabegrund: 'any ground',
      rueckgabestatus: '',
      amount: 1,
      paypal_refund_id: 'hasg27',
      paypal_refund_status: '',
      corrective_refund_nr: 0,
      is_corrective: 0
    });
    expect(component.dialog.open).toHaveBeenCalled();
  });
  function setDataTest() {
    returns = [];
    const ret: iProduktRueckgabe = {
      id: 1,
      bestellung: {} as iBestellung,
      produkte: [],
      kunde: {} as iUserData,
      rueckgabegrund: 'any ground',
      rueckgabestatus: '',
      amount: 1,
      paypal_refund_id: 'hasg27',
      paypal_refund_status: '',
      corrective_refund_nr: 0,
      is_corrective: 0
    };
    returns.push(ret);
  }
});
