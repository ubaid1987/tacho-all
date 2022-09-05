import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { InfringementComponent } from './pages/infringement/infringement.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UnitComponent } from './pages/unit/unit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'monthly',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'monthly',
    component: ProfileComponent,
  },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: 'infringement',
    component: InfringementComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'unit',
    component: UnitComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
