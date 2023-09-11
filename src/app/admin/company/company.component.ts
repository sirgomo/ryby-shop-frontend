import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { iCompany } from 'src/app/model/iCompany';
import { CompanyService } from './company.service';
import { Observable, map } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  companyForm: FormGroup;
  companies: iCompany[] = [];
  currentCompany = {} as iCompany;
  act$ = new Observable();
  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, public errorServeice: ErrorService) {
    this.companyForm = this.formBuilder.group({
      id: [''],
      name: [''],
      company_name: [''],
      address: [''],
      city: [''],
      postleitzahl: [''],
      country: [''],
      phone: [''],
      email: [''],
      isKleinUnternehmen: [false]
    });
  }

  ngOnInit(): void {

    this.act$ =  this.companyService.getAllCompanies().pipe(map(companies => {
      if(companies && companies.length > 0) {
        this.companies = companies;
        this.populateForm(this.companies[0]);
        this.currentCompany = this.companies[0];
        return companies;
      }
      return [];
    }));
  }

  populateForm(company: iCompany) {
    this.companyForm.patchValue({
      id: company.id,
      name: company.name,
      company_name: company.company_name,
      address: company.address,
      city: company.city,
      postleitzahl: company.postleitzahl,
      country: company.country,
      phone: company.phone,
      email: company.email,
      isKleinUnternehmen: company.isKleinUnternehmen
    });
  }
  save() {
   Object.assign(this.currentCompany, this.companyForm.value);
   this.currentCompany.isKleinUnternehmen = 1;
   if(this.companyForm.get('isKleinUnternehmen')?.getRawValue() === false) {
    this.currentCompany.isKleinUnternehmen = 0;
   }


    if(!this.currentCompany.id)
     return this.act$ = this.companyService.createCompany(this.currentCompany).pipe(map(res => {
      if(res.id) {
        this.populateForm(res);
        this.currentCompany = res;
      }
      return res;
    }))

    return this.act$ = this.companyService.updateCompany(this.currentCompany.id, this.currentCompany).pipe(map(res => {
      if(res.id) {
        this.populateForm(res);
        this.currentCompany = res;
        return this.currentCompany;
      }

      return res;
    }))
  }
}
