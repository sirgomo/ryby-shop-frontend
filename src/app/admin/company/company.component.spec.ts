import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CompanyComponent } from './company.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './company.service';
import { ErrorService } from 'src/app/error/error.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { iCompany } from 'src/app/model/iCompany';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let formBuilder: FormBuilder;
  let companyService: CompanyService;
  let errorService: ErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule ],
      providers: [
        FormBuilder,
        CompanyService,
        ErrorService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    companyService = TestBed.inject(CompanyService);
    errorService = TestBed.inject(ErrorService);
    jest.spyOn(companyService, 'getAllCompanies').mockReturnValue(of([{ id: 1, name: 'Company 1', company_name: '', address: '', city: '', country: '', phone: '', email: '', isKleinUnternehmen: 0 } ] ));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form when there are companies', fakeAsync( () => {

    component.act$.subscribe();
    tick();
    fixture.detectChanges();
    expect(component.companies.length).toBe(1);
    expect(component.currentCompany).toEqual({ id: 1, name: 'Company 1', company_name: '', address: '', city: '', country: '', phone: '', email: '', isKleinUnternehmen: 0 });
    expect(component.companyForm.value).toEqual({ id: 1, name: 'Company 1', company_name: '', address: '', city: '', country: '', phone: '', email: '', isKleinUnternehmen: 0 });
  }));

  it('should save a new company', fakeAsync( () => {
    fixture.detectChanges();

    jest.spyOn(companyService, 'createCompany').mockReturnValue(of({
    id: 1,
    name: 'Company 3',
    company_name: 'Company 3',
    address: 'Address 3',
    city: 'City 3',
    country: 'Country 3',
    phone: 'Phone 3',
    email: 'Email 3',
    isKleinUnternehmen: 0
  }));
    component.companyForm.setValue({ id: null,
    name: 'Company 3',
    company_name: 'Company 3',
    address: 'Address 3',
    city: 'City 3',
    country: 'Country 3',
    phone: 'Phone 3',
    email: 'Email 3',
    isKleinUnternehmen: 0
    });

    component.save();
    component.act$.subscribe();
    tick();
    fixture.detectChanges();

    expect(component.currentCompany).toEqual({ id: 1, name: 'Company 3', company_name: 'Company 3', address: 'Address 3', city: 'City 3', country: 'Country 3', phone: 'Phone 3', email: 'Email 3', isKleinUnternehmen: 0});
    expect(component.companyForm.value).toEqual({ id: 1, name: 'Company 3', company_name: 'Company 3', address: 'Address 3', city: 'City 3', country: 'Country 3', phone: 'Phone 3', email: 'Email 3', isKleinUnternehmen: 0 });
  }));

  it('should update an existing company', fakeAsync( () => {
    fixture.detectChanges();

    jest.spyOn(companyService, 'updateCompany').mockReturnValue(of({ id: 3, name: 'Updated Company',
    company_name: 'Updated Company',
    address: 'Updated Address',
    city: 'Updated City',
    country: 'Updated Country',
    phone: 'Updated Phone',
    email: 'Updated Email',
    isKleinUnternehmen: 0 }));

    component.currentCompany = { id: 3, name: 'Company 3', company_name: 'Company 3', address: 'Address 3', city: 'City 3', country: 'Country 3', phone: 'Phone 3', email: 'Email 3', isKleinUnternehmen: 1 };



    component.save();
    component.act$.subscribe();
    tick();
    fixture.detectChanges();

    expect(component.currentCompany).toEqual({  id: 3, name: 'Updated Company', company_name: 'Updated Company', address: 'Updated Address', city: 'Updated City', country: 'Updated Country', phone: 'Updated Phone', email: 'Updated Email', isKleinUnternehmen: 0  });
    expect(component.companyForm.value).toEqual({ id: 3, name: 'Updated Company', company_name: 'Updated Company', address: 'Updated Address', city: 'Updated City', country: 'Updated Country', phone: 'Updated Phone', email: 'Updated Email', isKleinUnternehmen: 0 });
  }));
});
