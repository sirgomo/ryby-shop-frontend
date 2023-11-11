import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from './auth/route.guard';
import { userGuard } from './auth/user.guard';
import { ProductsComponent } from './products/products.component';


export const routes: Routes = [
{
  path: 'shipping',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/shipping-cost/shipping-cost.component').then(m => m.ShippingCostComponent),
},
{
  path: 'lager',
  canActivate: [routeGuard],
  loadComponent: () => import('./admin/warehouse/warehouse.component').then(m => m.WarehouseComponent),
},
{
  path: 'ebay',
  canActivate: [routeGuard],
  loadComponent: () => import('./ebay/ebay.component').then(m => m.EbayComponent),
},
{
  path: 'ebay-subs',
  canActivate: [routeGuard],
  loadComponent: () => import('./ebay/ebay-subscriptions/ebay-subscriptions.component').then(m => m.EbaySubscriptionsComponent),
},
{
  path: 'ebay-items',
  canActivate: [routeGuard],
  loadComponent: () => import('./ebay/ebay-inventory/ebay-inventory.component').then(m => m.EbayInventoryComponent),
},
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
