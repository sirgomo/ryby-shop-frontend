import { CommonModule, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { SearchComponent } from 'src/app/search/search.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, SearchComponent, MatIconModule, CommonModule, MatButtonModule]
})
export class ToolbarComponent {
  isLogged = this.helper.isLogged;
  constructor (public helper: HelperService, private readonly authService: AuthService, @Inject(PLATFORM_ID) private readonly platformId: any) {}
  showLoginPanel() {
    if(isPlatformServer(this.platformId))
      return;

    this.helper.getLoginWindow();
  }
  logout() {
    this.authService.logout();
  }
  go() {
    this.helper.appComponenet.currentCategory = -1;
  }
}
