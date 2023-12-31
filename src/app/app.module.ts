import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
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
import {MatCardModule} from '@angular/material/card';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { ProductComponent } from './admin/product/product.component';
import { AddEditProductComponent } from './admin/add-edit-product/add-edit-product.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MY_FORMATS } from './const';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProductsComponent } from './products/products.component';
import { WareneingangComponent } from './admin/wareneingang/wareneingang.component';
import { ArtikelListComponent } from './admin/wareneingang/artikel-list/artikel-list.component';
import { ArtikelGebuchtComponent } from './admin/wareneingang/artikel-gebucht/artikel-gebucht.component';
import { AddEditBuchungComponent } from './admin/wareneingang/add-edit-buchung/add-edit-buchung.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AddEditProductToBuchungComponent } from './admin/wareneingang/add-edit-product-to-buchung/add-edit-product-to-buchung.component';
import { ItemComponent } from './products/item/item.component';
import { ItemDetailsComponent } from './products/item-details/item-details.component';
import { CardComponent } from './card/card.component';
import { CompanyComponent } from './admin/company/company.component';
import { ShippingAddressComponent } from './card/shipping-address-make-bestellung/shipping-address.component';
import { PaypalComponent } from './card/paypal/paypal.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './admin/order/order.component';
import { OrderDetailsComponent } from './admin/order/order-details/order-details.component';
import { OrderSelectorComponent } from './admin/order/order-selector/order-selector.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { InoviceComponent } from './inovice/inovice.component';
import { ImpressumComponent } from './admin/company/impressum/impressum.component';
import { AgbComponent } from './admin/company/agb/agb.component';
import { DatenSchutztComponent } from './admin/company/daten-schutzt/daten-schutzt.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
  /* FooterComponent,
    PaginatorComponent,
    ToolbarComponent,
    AppComponent,
    SearchComponent,*/
  ],
  imports: [
  /*  BrowserModule,
     MatButtonModule,
     MatIconModule,
     MatSidenavModule,
     MatToolbarModule,
     RouterModule,
     CommonModule,
     FormsModule,
     MatDialogModule,
     MatSnackBarModule,
     AppRoutingModule,
    JwtModule.forRoot({
      config: {}
    }),
*/
  ],
  providers: [
  /*  provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },*/
  ],
  exports: [],
  //bootstrap: [AppComponent]
  bootstrap: []
})
export class AppModule { }
