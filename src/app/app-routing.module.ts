import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { KategoriesComponent } from './admin/kategories/kategories.component';
import { LiferantsComponent } from './admin/liferants/liferants.component';
import { routeGuard } from './auth/route.guard';
import { UserComponent } from './user/user.component';
import { userGuard } from './auth/user.guard';
import { ProductComponent } from './admin/product/product.component';
import { ProductsComponent } from './products/products.component';
import { WareneingangComponent } from './admin/wareneingang/wareneingang.component';
import { CardComponent } from './card/card.component';
import { CompanyComponent } from './admin/company/company.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './admin/order/order.component';
import { ImpressumComponent } from './admin/company/impressum/impressum.component';
import { AgbComponent } from './admin/company/agb/agb.component';
import { DatenSchutztComponent } from './admin/company/daten-schutzt/daten-schutzt.component';

const routes: Routes = [
{
  component: AgbComponent,
  path: 'agb',
},
{
  component: CardComponent,
  path: 'card',
},
{
  component: DatenSchutztComponent,
  path: 'datenschutzt'
},
{
  component: OrdersComponent,
  path: 'order',
},
{
  component: OrderComponent,
  path: 'admin-order',
  canActivate: [routeGuard]
},
{
  component: CompanyComponent,
  path: 'company',
  canActivate: [routeGuard],
},
{
  component: WareneingangComponent,
  path: 'waren-eingang',
  canActivate: [routeGuard],
},
{
  component: ProductComponent,
  path: 'product',
  canActivate: [routeGuard],
},
{
  component: AdminComponent,
  path: 'admin',
  canActivate: [routeGuard],
},
{
  component: LiferantsComponent,
  path: 'liferant',
  canActivate: [routeGuard],
},
{
  component: ImpressumComponent,
  path: 'impressum',
},
{
  component: KategoriesComponent,
  path: 'kategory',
  canActivate: [routeGuard],
},
{
  component: UserComponent,
  path: 'user',
  canActivate: [userGuard],
},
{
  component: ProductsComponent,
  path: ''
},
{
  path: '**',
  redirectTo: ''
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
