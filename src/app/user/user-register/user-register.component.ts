import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { iRegisterUser } from 'src/app/model/iRegisterUser';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, ErrorComponent, MatIconModule, MatButtonModule, MatInputModule, MatCheckboxModule ]
})
export class UserRegisterComponent {
  dataPipe = inject(DatePipe);
  dialogRef= inject(MatDialogRef<UserRegisterComponent>);
  errorHandle= inject(ErrorService);
  userForm: FormGroup;
  showPassword: boolean = false;
  regSig$ = new Observable();

  constructor(private readonly userService: UserService, private readonly fb: FormBuilder) {
    this.userForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.required, Validators.pattern(/^(\+)?[0-9]{9,}$/)]],
      role: ['user'],
      registrierungsdatum: [''],
      treuepunkte: [0],
      shipping_name: ['null'],
      l_strasse:  ['null'],
      l_hausnummer: ['null'],
      l_stadt: ['null'],
      l_postleitzahl: ['null'],
      l_land: ['null'],
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
    const transformedDate = this.dataPipe.transform(Date.now(), 'mediumDate');
      if(transformedDate)
    data.registrierungsdatum =  transformedDate;
    this.regSig$ =  this.userService.createUser(data, this.dialogRef);
  }
  abbrechen() {
    this.dialogRef.close();
  }
}
