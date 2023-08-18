import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest, concatMap, map, of, tap } from 'rxjs';
import { iUserData } from '../model/iUserData';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class UserComponent implements OnInit{
  user$ = new Observable<iUserData>();
  userid: number | null = 0;
  userForm: FormGroup;
  constructor (private readonly userService: UserService, private readonly formBuilder: FormBuilder, private readonly datePi: DatePipe,
    private readonly dialog: MatDialog) {
    this.userForm = this.formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', Validators.required],
      adresseCheckbox: [false],
      shipping_name: [''],
      l_strasse: [''],
      l_hausnummer: [''],
      l_stadt: [''],
      l_postleitzahl: [''],
      l_land: [''],
      registrierungsdatum: [ { value: '', disabled: true }],
      treuepunkte: [ {value: 0, disabled: true}],
      adresseStrasse: ['', Validators.required],
      adresseHausnummer: ['', Validators.required],
      adresseStadt: ['', Validators.required],
      adressePostleitzahl: ['', Validators.required],
      adresseLand: ['', Validators.required]
    });
  }
  ngOnInit(): void {
   this.user$ = this.userService.getUserDetails().pipe(tap(res => {
    if(res === null)
      return;
    this.refreshForm(res);
    }));
  }
  private refreshForm(res: iUserData) {
    this.userid = res.id;

    const regDate = res?.registrierungsdatum?.split('T')[1] ? this.datePi.transform(new Date(res?.registrierungsdatum), 'dd-MM-yyyy') : res?.registrierungsdatum;


    this.userForm = this.formBuilder.group({
      vorname: [res?.vorname || '', Validators.required],
      nachname: [res?.nachname || '', Validators.required],
      email: [res?.email || '', [Validators.required, Validators.email]],
      telefon: [res?.telefon || '', Validators.required],
      adresseCheckbox: [false],
      shipping_name: [res?.lieferadresse?.shipping_name || ''],
      l_strasse: [res?.lieferadresse?.strasse || ''],
      l_hausnummer: [res?.lieferadresse?.hausnummer || ''],
      l_stadt: [res?.lieferadresse?.stadt || ''],
      l_postleitzahl: [res?.lieferadresse?.postleitzahl || ''],
      l_land: [res?.lieferadresse?.land || ''],
      registrierungsdatum: [{ value: regDate, disabled: true }],
      treuepunkte: [{ value: res?.treuepunkte, disabled: true }],
      adresseStrasse: [res?.adresse.strasse || '', Validators.required],
      adresseHausnummer: [res?.adresse.hausnummer || '', Validators.required],
      adresseStadt: [res?.adresse.stadt || '', Validators.required],
      adressePostleitzahl: [res?.adresse.postleitzahl || '', Validators.required],
      adresseLand: [res?.adresse.land || '', Validators.required]
    });
  }

  updateUser() {
    if (this.userid === null) {
      return ;
    }
    const item : iUserData = {
      id: this.userid,
      vorname: this.userForm.get('vorname')?.getRawValue(),
      nachname: this.userForm.get('nachname')?.getRawValue(),
      email: this.userForm.get('email')?.getRawValue(),
      telefon: this.userForm.get('telefon')?.getRawValue(),
      adresse: {
        strasse: this.userForm.get('adresseStrasse')?.getRawValue(),
        hausnummer: this.userForm.get('adresseHausnummer')?.getRawValue(),
        stadt: this.userForm.get('adresseStadt')?.getRawValue(),
        postleitzahl: this.userForm.get('adressePostleitzahl')?.getRawValue(),
        land: this.userForm.get('adresseLand')?.getRawValue(),
      },
      lieferadresse: {
        shipping_name: this.userForm.get('shipping_name')?.getRawValue(),
        strasse: this.userForm.get('l_strasse')?.getRawValue(),
        hausnummer: this.userForm.get('l_hausnummer')?.getRawValue(),
        stadt: this.userForm.get('l_stadt')?.getRawValue(),
        postleitzahl: this.userForm.get('l_postleitzahl')?.getRawValue(),
        land: this.userForm.get('l_land')?.getRawValue(),
      },
    };
    if(item.lieferadresse?.strasse !== undefined && item.lieferadresse?.strasse?.length < 3)
      item.lieferadresse = undefined;

    const tmp$ = of(item);
    this.user$ = combineLatest([this.user$, tmp$]).pipe(
      concatMap(() => this.userService.updateUser(item)),
      map(res => {
        res.registrierungsdatum = this.userForm.get('registrierungsdatum')?.getRawValue();
        res.treuepunkte = this.userForm.get('treuepunkte')?.getRawValue();

       this.refreshForm(res);
        return res as iUserData;
      })
    )
  }
  changePassword() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '400px';
    conf.width = '400px';

    this.dialog.open(ChangePasswordComponent, conf);
  }

}

