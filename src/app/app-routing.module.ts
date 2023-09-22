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

export const routes: Routes = [
{
  //component: AgbComponent,
  path: 'agb',
  loadComponent: () => import('./admin/company/agb/agb.component').then(m => m.AgbComponent),
},
{
 // component: CardComponent,
  path: 'card',
  loadComponent: () => import('./card/card.component').then(m => m.CardComponent),
},
{
 // component: DatenSchutztComponent,
  path: 'datenschutzt',
  loadComponent: () => import('./admin/company/daten-schutzt/daten-schutzt.component').then(m => m.DatenSchutztComponent),
},
{
//  component: OrdersComponent,
  path: 'order',
  loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent),
},
{
  //component: OrderComponent,
  path: 'admin-order',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/order/order.component').then(m => m.OrderComponent),
},
{
  //component: CompanyComponent,
  path: 'company',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/company/company.component').then(m => m.CompanyComponent),
},
{
  //component: WareneingangComponent,
  path: 'waren-eingang',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/wareneingang/wareneingang.component').then(m => m.WareneingangComponent),
},
{
 // component: ProductComponent,
  path: 'product',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/product/product.component').then(m => m.ProductComponent),
},
{
  //component: AdminComponent,
  path: 'admin',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
},
{
  //component: LiferantsComponent,
  path: 'liferant',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/liferants/liferants.component').then(m => m.LiferantsComponent),
},
{
  //component: ImpressumComponent,
  path: 'impressum',
  loadComponent: () => import('./admin/company/impressum/impressum.component').then(m => m.ImpressumComponent),
},
{
  //component: KategoriesComponent,
  path: 'kategory',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/kategories/kategories.component').then(m => m.KategoriesComponent),
},
{
 // component: UserComponent,
  path: 'user',
  canActivate: [userGuard],
  loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
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
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
