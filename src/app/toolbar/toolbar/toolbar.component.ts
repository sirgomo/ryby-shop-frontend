import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  isLogged = this.helper.isLogged;
  constructor (private readonly helper: HelperService, private readonly authService: AuthService) {}
  showLoginPanel() {
    this.helper.getLoginWindow();
  }
  logout() {
    this.authService.logout();
  }
}
