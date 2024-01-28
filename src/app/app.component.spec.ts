import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { iKategorie } from './model/iKategorie';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { Subject } from 'rxjs';
declare global {
  interface Window { gtag: Function; }
}
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, RouterTestingModule.withRoutes([]), MatDialogModule, HttpClientTestingModule, MatSnackBarModule, JwtModule.forRoot({ config: { tokenGetter: jest.fn() }}), NoopAnimationsModule
      ],
    }).compileComponents();
  });

  it(`should have as title '${environment.site_title}'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title()).toEqual(environment.site_title);
  });

  it('should open login dialog when login method is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    jest.spyOn(app.dialog, 'open');

    app.login();
    fixture.detectChanges();
    expect(app.dialog.open).toHaveBeenCalledWith(UserLoginComponent, expect.any(Object));
  });

  it('should update currentButtonActive when buttonActive is called with new index', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const newIndex = 5;

    app.buttonActive(newIndex);
    expect(app.currentButtonActive).toBe(newIndex);
  });

  it('should navigate to category when changeCategorie is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router, 'navigateByUrl');

    const category: iKategorie = {
      id: 1, name: 'testCategory',
      parent_id: null,
      products: []
    };
    app.changeCategorie(category);
    expect(spy).toHaveBeenCalledWith('/' + category.name);
  });

  it('should call updateTitle with empty string when showAll is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spy = jest.spyOn(app, 'updateTitle');

    app.showAll();
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spyRouterEvent = jest.spyOn(app.routerEventAnaliticsSub, 'unsubscribe');
    const spyCurrentRouter = jest.spyOn(app.currentRouterSub, 'unsubscribe');

    app.ngOnDestroy();
    expect(spyRouterEvent).toHaveBeenCalled();
    expect(spyCurrentRouter).toHaveBeenCalled();
  });

  it('should set Google Analytics when setGoogleAnalitics is called and platform is browser', () => {
    Object.defineProperty(window, 'gtag', { value: jest.fn(), writable: true });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(app, 'platformId', { value: 'browser', writable: true });

    localStorage.setItem('analitiks', 'yes');
    app.setGoogleAnalitics();
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", expect.any(Object));
  });

  it('should disable Google Analytics when setGoogleAnaliticsOff is called and platform is browser', () => {
    Object.defineProperty(window, 'gtag', { value: jest.fn(), writable: true });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(app, 'platformId', { value: 'browser', writable: true });

    app.setGoogleAnaliticsOff();
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", expect.any(Object));
  });
/*
   // not work
  it('should correctly filter router events for Google Analytics', () => {
     // Mock gtag function
     Object.defineProperty(window, 'gtag', { value: jest.fn(), writable: true });

     // Create a new Subject to mimic Router events
     const routerEvents = new Subject();

     // Provide a mock Router object
     const routerMock = {
       events: routerEvents.asObservable(),
       // Add any other router properties or methods you need to mock
     };

     TestBed.configureTestingModule({
       // other test module configuration,
       providers: [
         // Provide the mock router instead of the real router
         { provide: Router, useValue: routerMock },
       ],
     });

     const fixture = TestBed.createComponent(AppComponent);
     const app = fixture.componentInstance;
     Object.defineProperty(app, 'platformId', { value: 'browser', writable: true });

     localStorage.setItem('analitiks', 'yes');
     app.setGoogleAnaliticsRoutes();

     // Use the Subject's next method to simulate a NavigationEnd event
     routerEvents.next(new NavigationEnd(1, '/test', '/test'));

     // Your expectation
     expect(window.gtag).toHaveBeenCalledWith('config', environment.gtag, expect.any(Object));
  });*/

});
