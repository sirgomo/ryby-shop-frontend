import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JwtModule } from '@auth0/angular-jwt';
import { MY_FORMATS } from './app/const';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppRoutingModule, routes } from './app/app-routing.module';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { jwtInterceptorFn } from './app/interceptors/jwtInterceptorFn';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { LoaderInterceptorFn } from './app/interceptors/loader.interceptorFn';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withInterceptors([jwtInterceptorFn, LoaderInterceptorFn]), withFetch()),
      {
        provide: MomentDateAdapter,
        useClass: MomentDateModule,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {
        provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
      },
      provideRouter(routes, withComponentInputBinding()),
      importProvidersFrom(JwtModule.forRoot({})),
      importProvidersFrom(BrowserAnimationsModule),
      importProvidersFrom(AppRoutingModule),
      importProvidersFrom(MatSnackBarModule),
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
          subscriptSizing: 'dynamic',
        }
      }, provideCharts(withDefaultRegisterables())
    ]
  }).catch(err => {
    console.log(err);
  })
