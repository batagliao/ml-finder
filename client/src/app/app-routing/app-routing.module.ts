
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HomeComponent } from '../home/home.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

const appRoutes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      { enableTracing: false } // <!-- for debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
