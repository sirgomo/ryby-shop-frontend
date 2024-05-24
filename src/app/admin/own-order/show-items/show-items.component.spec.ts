import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShowItemsComponent } from './show-items.component';
import { CompanyService } from '../../company/company.service';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { iCompany } from 'src/app/model/iCompany';

describe('ShowItemsComponent', () => {
  let component: ShowItemsComponent;
  let fixture: ComponentFixture<ShowItemsComponent>;
  let httpTestingController: HttpTestingController;
  let companyService: CompanyService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        ShowItemsComponent
      ],
      providers: [
        CompanyService,
        ErrorService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowItemsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    companyService = TestBed.inject(CompanyService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    checkCompany();
  });

  it('should set columns with mwst', async () => {


    component.ngOnInit();
    const company: iCompany = {
      id:1,
      name: 'asd',
      company_name: 'fifo',
      address: '',
      city: '',
      postleitzahl: '',
      country: '',
      phone: '',
      email: '',
      isKleinUnternehmen: 0,
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false
    };
    const requ = await httpTestingController.match(`${environment.api}company/1`);
    requ.forEach((req) => {
      expect(req.request.method).toBe('GET');
      req.flush(company);
    })
    fixture.detectChanges();

      expect(component.columns()).toEqual(['sku', 'name', 'quantity', 'price','mwst', 'total', 'remove']);

  });

  it('should set columns with no mwst', async () => {


    component.ngOnInit();
    const company: iCompany = {
      id:1,
      name: 'asd',
      company_name: 'fifo',
      address: '',
      city: '',
      postleitzahl: '',
      country: '',
      phone: '',
      email: '',
      isKleinUnternehmen: 1,
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false
    };

    const requ = await httpTestingController.match(`${environment.api}company/1`);
    requ.forEach((req) => {
      expect(req.request.method).toBe('GET');
      req.flush(company);
    })
    await component.ngOnInit();
    const requ3 = await httpTestingController.expectOne(`${environment.api}company/1`);
    requ3.flush(company);
    fixture.detectChanges();


    expect(component.columns()).toEqual(['sku', 'name', 'quantity', 'price', 'total', 'remove']);

  });

  it('should calculate item price brutto correctly', () => {
    checkCompany();
    component.currentProducs = [
      {
        mehrwehrsteuer: 20,
        variations: [{ price: 100, quanity: 2, sku: '123' }]
      }
    ] as unknown as iProduct[];

    const priceBrutto = component.getItemPriceBrutto(0);
    expect(priceBrutto).toEqual(240);
  });

  it('should calculate total brutto correctly', () => {
    checkCompany();
    component.currentProducs = [
      {
        mehrwehrsteuer: 20,
        variations: [{ price: 100, quanity: 2, sku: '123' }]
      }
    ] as unknown as iProduct[];

    const totalBrutto = component.getTotalBrutto();
    expect(totalBrutto).toEqual(240);
  });

  it('should calculate total netto correctly', () => {
    checkCompany();
    component.currentProducs = [
      {
        variations: [{ price: 100, mehrwehrsteuer: 20, quanity: 2, sku: '123' }]
      }
    ] as unknown as iProduct[];

    const totalNetto = component.getTotal();
    expect(totalNetto).toEqual(200);
  });

  it('should emit index on removeItem', () => {
    checkCompany();
    jest.spyOn(component.index, 'emit');

    component.currentProducs = [
      {
        variations: [{ price: 100, mehrwehrsteuer: 20, quanity: 2, sku: '123' }]
      }
    ] as unknown as iProduct[];

    component.removeItem(0);
    expect(component.index.emit).toHaveBeenCalledWith(0);
  });

  it('should emit -1 on save', () => {
    checkCompany();
    jest.spyOn(component.index, 'emit');

    component.save();
    expect(component.index.emit).toHaveBeenCalledWith(-1);
  });

  it('should emit -2 on clearItems', () => {
    checkCompany();
    jest.spyOn(component.index, 'emit');

    component.clearItems();
    expect(component.index.emit).toHaveBeenCalledWith(-2);
  });

  it('should render table rows correctly', () => {
    checkCompany();
    component.currentProducs = [
      {
        name: 'Product 1',
        variations: [{ price: 100, mehrwehrsteuer: 20, quanity: 2, sku: '123' }]
      }
    ] as unknown as iProduct[];

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr'));
    expect(rows.length).toBe(2);
  });
  async function checkCompany() {
    const company: iCompany = {
      id:1,
      name: 'asd',
      company_name: 'fifo',
      address: '',
      city: '',
      postleitzahl: '',
      country: '',
      phone: '',
      email: '',
      isKleinUnternehmen: 1,
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false
    };
    const requ = await httpTestingController.expectOne(`${environment.api}company/1`);
    expect(requ.request.method).toBe('GET');
    requ.flush(company);
  }
});


