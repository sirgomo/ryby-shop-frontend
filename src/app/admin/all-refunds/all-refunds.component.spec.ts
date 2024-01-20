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

describe('AllRefundsComponent', () => {
  let component: AllRefundsComponent;
  let fixture: ComponentFixture<AllRefundsComponent>;
  let testControll: HttpTestingController;
  let returns: iProduktRueckgabe[];

  beforeEach(async () => {
    setDataTest();
    await TestBed.configureTestingModule({
      imports: [AllRefundsComponent, CommonModule, MatTabsModule, MatTableModule, ErrorComponent, PaginatorComponent,
         ProductsQuanitySelectorComponent, MatButtonModule, MatIconModule, ShowEbayRefundsComponent, HttpClientTestingModule, NoopAnimationsModule]
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
  function setDataTest() {
    returns = [];
    const ret: iProduktRueckgabe = {
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
