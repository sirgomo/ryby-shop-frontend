import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HelperService } from 'src/app/helper/helper.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor (private readonly helper: HelperService) {}
  showLoginPanel() {
    this.helper.getLoginWindow();
  }
}
