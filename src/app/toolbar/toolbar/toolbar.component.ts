import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule, isPlatformServer } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription, fromEvent, withLatestFrom, zipWith } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { SearchComponent } from 'src/app/search/search.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, SearchComponent, MatIconModule, CommonModule, MatButtonModule, RouterModule]
})
export class ToolbarComponent implements OnDestroy, AfterViewInit{
  isLogged = this.helper.isLogged;
  deviceWidthSub = new Subscription();
  widthSig = signal(0);
  constructor (public helper: HelperService, private readonly authService: AuthService, @Inject(PLATFORM_ID) private readonly platformId: any,
  private readonly breakPoint: BreakpointObserver) {
    this.breakPoint.observe([ "(max-width: 600px)"]).subscribe((result: BreakpointState) => {
      if(result.matches) {
          this.widthSig.set(599);
      } else {
        this.widthSig.set(700);
        if(this.helper.appComponenet.sidenav && !this.helper.appComponenet.sidenav.opened)
        this.showHideMenu();
      }

    })
  }
  ngAfterViewInit(): void {
    if(typeof window === 'undefined' )
      return;

    const button = document.getElementById('menu_button');
    fromEvent<TouchEvent>(document, 'touchstart')
    .pipe(
      zipWith(
        fromEvent<TouchEvent>(document, 'touchend').pipe(
          withLatestFrom(fromEvent<TouchEvent>(document, 'touchmove'))
        )
      )
    )
    .subscribe(([touchstart, [_, touchmove]]) => {
      const xDiff =
        touchstart.touches[0].clientX - touchmove.touches[0].clientX;
      if (Math.abs(xDiff) > 0.3 * document.body.clientWidth &&
          touchstart.timeStamp <= touchmove.timeStamp) {
        if (xDiff > 0) {
          button?.click();
        } else {
          button?.click();
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.deviceWidthSub.unsubscribe();
  }
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
  showHideMenu() {
    this.helper.appComponenet.sidenav.toggle();
  }
}
