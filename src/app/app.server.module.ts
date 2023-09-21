import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';



@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  //bootstrap: [AppComponent],
  bootstrap: [],
})
export class AppServerModule {}
