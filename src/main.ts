import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { MY_FORMATS } from './app/const';
import { provideRouter } from '@angular/router';
import { AppRoutingModule, routes } from './app/app-routing.module';
import { importProvidersFrom } from '@angular/core';

/*
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));*/
  await bootstrapApplication(AppComponent, {
    providers: [
      {
        provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
      },
      {
        provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
      },
      provideRouter(routes),
      importProvidersFrom(JwtModule.forRoot({})),
    ]
  }).catch(err => {
    console.log(err);
  })
