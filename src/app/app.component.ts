import { Component, ViewChild } from '@angular/core';
import { HelperService } from './helper/helper.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true}) sidenav!: MatSidenav;
  title = 'ryby-shop-frontend';
  constructor(private readonly helper: HelperService) {}
  menu$ = this.helper.menu$;
}
