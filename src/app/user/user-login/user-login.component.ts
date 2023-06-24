import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../user.service';
import { iLogin } from 'src/app/model/iLogin';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginComponent {
  loginData: iLogin = {
    email: '',
    password: ''
  };
  login$ = new Observable();
  constructor(private readonly userService: UserService, private readonly authService: AuthService, private readonly dialog: MatDialog,private readonly dialReg: MatDialogRef<UserLoginComponent>) {}
login() {
  if (this.loginData.email.length > 5 && this.loginData.password.length > 5) {
   this.login$ = this.userService.login(this.loginData);
  }
}
registerUser() {
  const conf: MatDialogConfig = new MatDialogConfig();
  conf.width = '800px';
  conf.height = '700px';

  this.dialog.open(UserRegisterComponent, conf);
  this.dialReg.close();
}
close(){
  this.dialReg.close();
}
}
