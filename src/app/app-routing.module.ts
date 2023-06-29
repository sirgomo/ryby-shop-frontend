import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { KategoriesComponent } from './admin/kategories/kategories.component';
import { LiferantsComponent } from './admin/liferants/liferants.component';
import { routeGuard } from './auth/route.guard';
import { UserComponent } from './user/user.component';
import { userGuard } from './auth/user.guard';

const routes: Routes = [
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
  path: '**',
  redirectTo: ''
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
