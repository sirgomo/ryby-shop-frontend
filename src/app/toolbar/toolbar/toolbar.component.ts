import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { SearchComponent } from 'src/app/search/search.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, SearchComponent, MatIconModule, CommonModule]
})
export class ToolbarComponent {
  isLogged = this.helper.isLogged;
  constructor (public helper: HelperService, private readonly authService: AuthService) {}
  showLoginPanel() {
    this.helper.getLoginWindow();
  }
  logout() {
    this.authService.logout();
  }
  go() {
    this.helper.appComponenet.currentCategory = -1;
  }
}
