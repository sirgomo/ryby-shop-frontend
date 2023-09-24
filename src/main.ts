import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { JwtModule } from '@auth0/angular-jwt';
import { MY_FORMATS } from './app/const';
import { provideRouter } from '@angular/router';
import { AppRoutingModule, routes } from './app/app-routing.module';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { jwtInterceptorFn } from './app/interceptors/jwtInterceptorFn';


  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withInterceptors([jwtInterceptorFn])),
      {
        provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
      },
      provideRouter(routes),
      importProvidersFrom(JwtModule.forRoot({})),
      importProvidersFrom(BrowserAnimationsModule),
      importProvidersFrom(AppRoutingModule),
      importProvidersFrom(MatSnackBarModule)
    ]
  }).catch(err => {
    console.log(err);
  })
