import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HelperService } from './helper/helper.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { KategorieService } from './admin/kategories/kategorie.service';
import { iKategorie } from './model/iKategorie';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer/footer.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ToolbarComponent } from './toolbar/toolbar/toolbar.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoockieInfoComponent } from './admin/company/coockie-info/coockie-info.component';
import { Subscription, filter } from 'rxjs';
import { environment } from 'src/environments/environment';
declare let gtag: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ FooterComponent, PaginatorComponent, RouterModule, ToolbarComponent, MatSidenavModule, CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class AppComponent  implements OnInit, OnDestroy{

  @ViewChild('sidenav', { static: true}) sidenav!: MatSidenav;
  showLoaderSig = this.helper.showLoaderSig;
  title = this.helper.titelSig;
  currentCategory = -1;
  currentButtonActive = -1;
  kategorie$ = this.katService.kategorie$;
  menu$ = this.helper.menu$;
  routerEvent$ = new Subscription();
  defaultTitile = '';
  constructor(private readonly helper: HelperService, private readonly dialog: MatDialog, private readonly katService: KategorieService,
  private readonly router: Router, @Inject(PLATFORM_ID) private readonly platformId: any) {
    this.helper.setApp(this);
  }



  login() {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '400px';
    conf.height = '400px';
    localStorage.removeItem('role');
    this.dialog.open(UserLoginComponent, conf);
  }
  buttonActive(index: number) {
    if(this.currentButtonActive === index)
      return;

    this.currentButtonActive = index;
    this.helper.showLoaderSig.set(true);
  }
  changeCategorie(item: iKategorie) {
    if(item.id === this.currentCategory)
      return;
    this.helper.kategorySig.set(item);
    this.currentCategory = item.id;
    this.router.navigateByUrl('/'+item.name);
    this.updateTitle(item.name);
    this.helper.showLoaderSig.set(true);
  }
  showAll() {
    this.helper.kategorySig.set({} as iKategorie);
    this.currentCategory = 0;
    this.router.navigateByUrl('');
    this.updateTitle('');
  }
  ngOnInit(): void {
    this.askCookies();
  }
  askCookies() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '400px';
    conf.height = '400px';
    conf.position = { bottom: '5%', right: '5%' };
    this.dialog.open(CoockieInfoComponent, conf);
  }

  setGoogleAnalitics() {

    if(isPlatformServer(this.platformId))
      return;

      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
    });
    this.setGoogleAnaliticsRoutes();
  }
  setGoogleAnaliticsOff() {

    if(isPlatformServer(this.platformId))
      return;

      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied"
    });
    this.routerEvent$.unsubscribe();
  }
  setGoogleAnaliticsRoutes() {
     this.routerEvent$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd ))
     .subscribe((event) => {
      const ev = event as NavigationEnd;
      console.log('zmiana strony')
      gtag('config', environment.gtag, {
        page_path: ev.urlAfterRedirects
      });
     });
  }
  ngOnDestroy(): void {
   this.routerEvent$.unsubscribe();
  }
  updateTitle(name: string) {
    this.helper.titelSig.update((title) => {
      if(this.defaultTitile.length < 2)
        this.defaultTitile = title;

        if(name.length < 2)
        return this.defaultTitile

        return this.defaultTitile + ' '+ name;
    })
  }
}
