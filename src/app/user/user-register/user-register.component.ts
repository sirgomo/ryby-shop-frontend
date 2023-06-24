import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { DatePipe } from '@angular/common';
import { iRegisterUser } from 'src/app/model/iRegisterUser';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegisterComponent {
  userForm: FormGroup;
  showPassword: boolean = false;


  constructor(private readonly userService: UserService, private readonly fb: FormBuilder, private readonly dataPipe: DatePipe, private dialogRef: MatDialogRef<UserRegisterComponent>) {
    this.userForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.required, Validators.pattern(/^\+[0-9]{9,}$/)]],
      role: ['user'],
      registrierungsdatum: [''],
      treuepunkte: [0],
      l_strasse: [''],
      l_hausnummer: [''],
      l_stadt: [''],
      l_postleitzahl: [''],
      l_land: [''],
      adresseStrasse: ['', Validators.required],
      adresseHausnummer: ['', Validators.required],
      adresseStadt: ['', Validators.required],
      adressePostleitzahl: ['', Validators.required],
      adresseLand: ['', Validators.required],
      isDifferentAddress: [false],
    })
  }
  togglePasswordVisibility() {
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      const currentType = passwordControl.get('type')?.value;
      passwordControl.get('type')?.setValue(currentType === 'password' ? 'text' : 'password');
    }
  }
  sendDataToServer(data: iRegisterUser) {
    const transformedDate = this.dataPipe.transform(Date.now(), 'shortDate');
    const tmp = transformedDate ? new Date(transformedDate) : null;
    if(tmp !== null)
    data.registrierungsdatum =  tmp;
    console.log(data);
    this.userService.createUser(data);
  }
  abbrechen() {
    this.dialogRef.close();
  }
}
