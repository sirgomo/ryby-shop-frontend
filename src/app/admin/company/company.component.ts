import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { iCompany } from 'src/app/model/iCompany';
import { CompanyService } from './company.service';
import { Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddUrlopComponent } from '../show-urlop/add-urlop/add-urlop.component';
import { iUrlop } from 'src/app/model/iUrlop';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorComponent, CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatButtonModule]
})
export class CompanyComponent {

  companyForm: FormGroup;
  companies!: iCompany;
  currentCompany = {} as iCompany;
  act$ = new Observable();
  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, public errorServeice: ErrorService, private readonly dialog: MatDialog) {
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
      isKleinUnternehmen: [false],
      ustNr: [''],
      fax: [''],
      eu_komm_hinweis: [''],
      agb: [''],
      daten_schutzt: [''],
      cookie_info: [''],
      is_in_urlop: [false],
    });
  }

  ngOnInit(): void {

    this.act$ =  this.companyService.getAllCompanies().pipe(map(companies => {
      if(companies && companies.id === 1) {
        this.companies = companies;
        this.populateForm(this.companies);
        this.currentCompany = this.companies;
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
      ustNr: company.ustNr,
      fax: company.fax,
      eu_komm_hinweis: company.eu_komm_hinweis,
      isKleinUnternehmen: company.isKleinUnternehmen,
      agb: company.agb,
      daten_schutzt: company.daten_schutzt,
      cookie_info: company.cookie_info,
      is_in_urlop: company.is_in_urlop,
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
  setUrlop() {
    let dialogRef: MatDialogRef<AddUrlopComponent>
    if(!this.currentCompany.is_in_urlop) {
      const conf = new MatDialogConfig();
      conf.width = '100%';
      conf.height = '100%';
      conf.data = {id: this.currentCompany.id};

     dialogRef = this.dialog.open(AddUrlopComponent, conf);
     dialogRef.afterClosed().subscribe((res) => {
      if(res === undefined)
      this.companyForm.patchValue({ 'is_in_urlop': false});
      else
      this.currentCompany.is_in_urlop = true;
     })
    } else {
      if(window)
      if(window.confirm('Möchten Sie wirklich den Urlaub ausschalten? (Der Urlaub wird auch auf eBay deaktiviert)')) {
        const item = {} as iUrlop;
        if(this.currentCompany.id)
        item.id = this.currentCompany.id;
        item.is_in_urlop = false;

       this.act$ = combineLatest([this.act$, of(item)]).pipe(
          switchMap(([curr, item]) =>  this.companyService.setUrlop(item)),
          map((res) =>  {
            if(res.affected === 1) {
              this.companyForm.patchValue({ 'is_in_urlop': false});
              this.currentCompany.is_in_urlop = false;
            }


            return this.currentCompany;

          })
        )
      }
    }
    }
}
