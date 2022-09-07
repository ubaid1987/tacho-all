import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { HelpComponent } from './pages/help/help.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalService } from './modal/modal.service';
import { ModalComponent } from './modal/modal.component';
import { InfringementComponent } from './pages/infringement/infringement.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { UnitComponent } from './pages/unit/unit.component';
import { AutoFocusDirectiveDirective } from './auto-focus-directive.directive';
@NgModule({
  declarations: [AppComponent, HomeComponent, ProfileComponent, AboutComponent, HelpComponent, NotFoundComponent,
    ModalComponent, InfringementComponent, CustomerComponent,UnitComponent,AutoFocusDirectiveDirective ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
  ],
  providers: [ModalService],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule {}
