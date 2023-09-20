import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { iNewPassword } from 'src/app/model/iNewPassword';
import { Observable, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorComponent, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule, CommonModule]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  active$ = new Observable();
  constructor(private formBuilder: FormBuilder, private readonly userSer: UserService, private readonly authSer: AuthService, public err: ErrorService, private readonly diaRef: MatDialogRef<ChangePasswordComponent>) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator } as AbstractControlOptions);
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const pass: iNewPassword = {
        userid: this.authSer.getUserId(),
        altPassword: this.changePasswordForm.get('oldPassword')?.value,
        newPassword: this.changePasswordForm.get('confirmPassword')?.value
      }
      this.active$ = this.userSer.changePassword(pass).pipe(tap((res) => {
        if(res === 1)
          this.diaRef.close()
      }));
    }
  }

}
