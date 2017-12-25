import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpClient } from '@angular/common/http';

import { ModalDirective, ModalModule } from 'ngx-bootstrap';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductService } from './services/product.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { GeoLocationService } from './services/geolocation.service';

import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    ProductDetailComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [
    ProductService,
    GeoLocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
