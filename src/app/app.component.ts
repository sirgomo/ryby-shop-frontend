import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges, ViewChild, signal } from '@angular/core';
import { HelperService } from './helper/helper.service';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { KategorieService } from './admin/kategories/kategorie.service';
import { iKategorie } from './model/iKategorie';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar/toolbar.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoockieInfoComponent } from './admin/company/coockie-info/coockie-info.component';
import { Subscription, filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyService } from './admin/company/company.service';
import { ShowUrlopComponent } from './admin/show-urlop/show-urlop.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScroolServiceService } from './helper/scroolService.service';



declare const gtag: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ FooterComponent, RouterModule, ToolbarComponent, MatSidenavModule, CommonModule, 
    MatDialogModule, MatButtonModule, MatProgressSpinnerModule, ShowUrlopComponent, RouterOutlet]
})
export class AppComponent  implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('sidenav', { static: true}) sidenav!: MatSidenav;
  @ViewChild('sidenavContent', { read: MatSidenavContent }) sidenavContent!: MatSidenavContent;

  showLoaderSig = this.helper.showLoaderSig;
  h1SigDefault = 'Kunstköder, Ruten, Rollen und vieles mehr...';
  title = this.helper.titelSig;
  h1sig = signal(this.h1SigDefault);
  currentCategory = -1;
  currentButtonActive = -1;
  kategorieSig = toSignal(this.katService.kategorie$);
  menu$ = this.helper.menu$;
  routerEventAnaliticsSub = new Subscription();
  currentRouterSub = new Subscription();
  link = signal('');

  constructor(private readonly helper: HelperService, public readonly dialog: MatDialog, private readonly katService: KategorieService,
  public readonly router: Router, @Inject(PLATFORM_ID) public readonly platformId: any, public readonly companyService: CompanyService,
  private scrollService: ScroolServiceService
 ) {
    this.helper.setApp(this);
    
    
  }

  ngAfterViewInit(): void {
    this.scrollService.setSideNavContent(this.sidenavContent);
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
    this.helper.showLoader.next(true);
  }
  changeCategorie(item: iKategorie) {
    if (!item || item.id === this.currentCategory)
      return;
    this.helper.pageNrSig.set(1);
    this.helper.kategorySig.set(item);
    this.currentCategory = item.id;
    this.router.navigate(['',item.name]);
    this.updateTitleAndH1(item.name);
    this.helper.showLoader.next(true);
    this.resetScroll();
    
  }
  showAll() {
    this.helper.pageNrSig.set(1);
    this.currentCategory = -1;
    this.resetScroll();
    this.router.navigateByUrl('');
    this.updateTitleAndH1('');
    this.helper.kategorySig.set({} as iKategorie);
  
  }
  ngOnInit(): void {
    if(isPlatformServer(this.platformId))
    return;

    if(localStorage.getItem('cookies') && localStorage.getItem('analitiks') && localStorage.getItem('analitiks') == 'yes')
      this.setGoogleAnalitics();

    if(!localStorage.getItem('cookies'))
      this.askCookies();


  }
  askCookies() {
    if(isPlatformServer(this.platformId))
    return;


    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '400px';
    conf.height = '400px';
    conf.position = { bottom: '5%', right: '5%' };
    this.dialog.open(CoockieInfoComponent, conf);

    localStorage.setItem('cookies', Date.now().toString());
  }

  setGoogleAnalitics() {
    if(isPlatformServer(this.platformId))
      return;

      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
    });
    localStorage.setItem('analitiks', 'yes');
    this.setGoogleAnaliticsRoutes();
  }
  setGoogleAnaliticsOff() {

    if(isPlatformServer(this.platformId))
      return;

      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied"
    });
    localStorage.setItem('analitiks', 'no');
    this.routerEventAnaliticsSub.unsubscribe();
  }
  setGoogleAnaliticsRoutes() {
     this.routerEventAnaliticsSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd ))
     .subscribe((event) => {
      const ev = event as NavigationEnd;
      gtag('config', environment.gtag, {
        page_path: ev.urlAfterRedirects
      });
     });
  }
  ngOnDestroy(): void {
   this.routerEventAnaliticsSub.unsubscribe();
   this.currentRouterSub.unsubscribe();
  }

  updateTitleAndH1(name: string) {
    this.helper.titelSig.update((title) => {
        if(name.length < 2)
        return title = environment.site_title;

        return title = environment.site_title + ' - '+ name;
    })
    this.h1sig.update((val) => {
        if(name.length < 2) {
          this.link.set('');
          return val = this.h1SigDefault;
        } else {
          this.link.set(name);
          return val = name.charAt(0).toUpperCase()+name.slice(1)+': '
        }

    });
   
  }
  resetScroll(top = 0) {
    if(isPlatformServer(this.platformId))
      return;

      if(this.sidenavContent)
        this.sidenavContent.scrollTo({'top' : top, 'behavior': 'smooth'});

  }
}
