import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CompanyComponent } from './company.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './company.service';
import { ErrorService } from 'src/app/error/error.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iCompany } from 'src/app/model/iCompany';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let formBuilder: FormBuilder;
  let companyService: CompanyService;
  let testController: HttpTestingController;
  const company: iCompany = {
    id: 1,
    name: 'ashdjahskj',
    company_name: 'asghdahs',
    address: 'asjdhjas ',
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
    is_in_urlop: false,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompanyComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [FormBuilder, CompanyService, ErrorService],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);

  });
  beforeEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form when there are companies', () => {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api + 'company');
    expect(requ.request.method).toBe('GET');
    requ.flush([{
      id: 1,
      name: 'ashdjahskj',
      company_name: 'asghdahs',
      address: 'asjdhjas ',
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
      is_in_urlop: false,
    }]);

    fixture.detectChanges();
    expect(component.currentCompany).toEqual({
      id: 1,
      name: 'ashdjahskj',
      company_name: 'asghdahs',
      address: 'asjdhjas ',
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
      is_in_urlop: false,
    });
    expect(component.companyForm.value).toEqual({
      id: 1,
      name: 'ashdjahskj',
      company_name: 'asghdahs',
      address: 'asjdhjas ',
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
      is_in_urlop: false,
    });
  });

  it('should update an existing company', () => {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api + 'company');
    expect(requ.request.method).toBe('GET');
    requ.flush([{
      id: 1,
      name: 'ashdjahskj',
      company_name: 'asghdahs',
      address: 'asjdhjas ',
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
      is_in_urlop: false,
    }]);
    fixture.detectChanges();
    const update = {
      id: 1,
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      postleitzahl: '',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    };
    component.companyForm.setValue(update);
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();
    const requ1 = testController.expectOne(environment.api + 'company/1');
    expect(requ1.request.method).toBe('PUT');
    requ1.flush(update)
    fixture.detectChanges();

    expect(component.currentCompany).toEqual({
      id: 1,
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      postleitzahl: '',
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    });
    expect(component.companyForm.value).toEqual({
      id: 1,
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      postleitzahl: '',
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    });
  });

  it('should save a new company', () => {
    fixture.detectChanges();
    const requ = testController.expectOne(environment.api + 'company');
    expect(requ.request.method).toBe('GET');
    requ.flush([]);
    fixture.detectChanges();
    const update = {
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      postleitzahl: '',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    };
    component.companyForm.patchValue(update);
    fixture.detectChanges();
    const butt = fixture.nativeElement.querySelector('button');
    butt.click();
    fixture.detectChanges();
    const requ1 = testController.expectOne(environment.api + 'company');
    expect(requ1.request.method).toBe('POST');
    requ1.flush({...update,
      id: 1,
    })
    fixture.detectChanges();

    expect(component.currentCompany).toEqual({
      id: 1,
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      postleitzahl: '',
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    });
    expect(component.companyForm.value).toEqual({
      id: 1,
      name: 'Company 3',
      company_name: 'Company 3',
      address: 'Address 3',
      city: 'City 3',
      country: 'Country 3',
      phone: 'Phone 3',
      email: 'Email 3',
      isKleinUnternehmen: 0,
      postleitzahl: '',
      ustNr: '',
      fax: '',
      eu_komm_hinweis: '',
      agb: '',
      daten_schutzt: '',
      cookie_info: '',
      is_in_urlop: false,
    });
  });
});
