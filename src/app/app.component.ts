import { Component, ViewChild } from '@angular/core';
import { HelperService } from './helper/helper.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { iMenuItem } from './model/iMenuItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true}) sidenav!: MatSidenav;
  title = 'ryby-shop-frontend';
  constructor(private readonly helper: HelperService, private readonly dialog: MatDialog) {
    this.helper.setApp(this);
  }
  menu$ = this.helper.menu$;
  login() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '400px';
    conf.height = '400px';

    this.dialog.open(UserLoginComponent, conf);
  }
  buttonActive(index: number) {

  }
}
