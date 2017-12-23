import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';


const appRoutes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', Component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      {enableTracing: false }) // <-- use true for debug purposes only
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
