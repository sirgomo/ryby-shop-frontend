import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { HelperService } from './helper/helper.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { KategorieService } from './admin/kategories/kategorie.service';
import { iKategorie } from './model/iKategorie';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer/footer.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ToolbarComponent } from './toolbar/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ FooterComponent, PaginatorComponent, RouterModule, ToolbarComponent, MatSidenavModule, CommonModule, MatDialogModule, MatButtonModule]
})
export class AppComponent implements AfterContentChecked {

  @ViewChild('sidenav', { static: true}) sidenav!: MatSidenav;
  title = this.helper.titelSig;
  currentCategory = 0;
  kategorie$ = this.katService.kategorie$;
  menu$ = this.helper.menu$;
  constructor(private readonly helper: HelperService, private readonly dialog: MatDialog, private readonly katService: KategorieService, private changeRef: ChangeDetectorRef,
  private readonly router: Router, @Inject(PLATFORM_ID) private readonly platformId: any) {
    this.helper.setApp(this);
  }
  ngAfterContentChecked(): void {
   this.changeRef.detectChanges();
  }

  login() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '400px';
    conf.height = '400px';
    localStorage.removeItem('role');
    this.dialog.open(UserLoginComponent, conf);
  }
  buttonActive(index: number) {

  }
  changeCategorie(item: iKategorie) {
    this.helper.kategorySig.set(item);
    this.currentCategory = item.id;
    this.router.navigateByUrl('');
  }
  showAll() {
    this.helper.kategorySig.set({} as iKategorie);
    this.currentCategory = 0;
    this.router.navigateByUrl('');
  }
}
