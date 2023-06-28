import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './toolbar/toolbar/toolbar.component';
import { FooterComponent } from './footer/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { SearchComponent } from './search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorComponent } from './error/error.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminComponent } from './admin/admin.component';
import { LiferantsComponent } from './admin/liferants/liferants.component';
import { AddEditLiferantComponent } from './admin/add-edit-liferant/add-edit-liferant.component';
import { AddEditKategorieComponent } from './admin/add-edit-kategorie/add-edit-kategorie.component';
import { KategoriesComponent } from './admin/kategories/kategories.component';
import { UserComponent } from './user/user.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    SearchComponent,
    UserLoginComponent,
    UserRegisterComponent,
    ErrorComponent,
    AdminComponent,
    LiferantsComponent,
    AddEditLiferantComponent,
    AddEditKategorieComponent,
    KategoriesComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {}
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
