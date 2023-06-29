import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { iUserData } from '../model/iUserData';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit{
  user$ = new Observable<iUserData>();
  userForm: FormGroup;
  constructor (private readonly userService: UserService, private readonly formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', Validators.required],
      adresseCheckbox: [false],
      l_strasse: [''],
      l_hausnummer: [''],
      l_stadt: [''],
      l_postleitzahl: [''],
      l_land: [''],
      treuepunkte: [0, Validators.min(0)],
      adresseStrasse: ['', Validators.required],
      adresseHausnummer: ['', Validators.required],
      adresseStadt: ['', Validators.required],
      adressePostleitzahl: ['', Validators.required],
      adresseLand: ['', Validators.required]
    });
  }
  ngOnInit(): void {
   this.user$ = this.userService.getUserDetails().pipe(tap(res => {
    this.userForm = this.formBuilder.group({
      vorname: [res.vorname || '', Validators.required],
      nachname: [res.nachname || '', Validators.required],
      email: [res.email || '', [Validators.required, Validators.email]],
      telefon: [res.telefon || '', Validators.required],
      adresseCheckbox: [false],
      l_strasse: [ res.lieferadresse?.l_strasse ||''],
      l_hausnummer: [res.lieferadresse?.l_hausnummer || ''],
      l_stadt: [res.lieferadresse?.l_stadt || ''],
      l_postleitzahl: [res.lieferadresse?.l_postleitzahl || ''],
      l_land: [ res.lieferadresse?.l_land || ''],
      treuepunkte: [0, Validators.min(0)],
      adresseStrasse: [res.adresse.strasse || '', Validators.required],
      adresseHausnummer: [res.adresse.hausnummer || '', Validators.required],
      adresseStadt: [res.adresse.stadt || '', Validators.required],
      adressePostleitzahl: [res.adresse.postleitzahl || '', Validators.required],
      adresseLand: [res.adresse.land || '', Validators.required]
    });
    }));
  }



}

