import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule  } from "@angular/common/http";

import { RouterModule } from "@angular/router";

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDatabase } from "./../in-memory-database";
import { NavbarComponent } from './components/navbar/navbar.component'; 

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    // intercepta todas as requisições HTTP da aplicação
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    RouterModule
  ],
  // precisa exportar, para que modules que importem o core.module 
  //   possam enxergar estes modules importados do core.modules
  exports: [
    // shared modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // shared components
    NavbarComponent
  ]
})
export class CoreModule { }
