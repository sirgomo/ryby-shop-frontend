import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';



@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [ provideClientHydration()],
  bootstrap: [],
})
export class AppServerModule {}
