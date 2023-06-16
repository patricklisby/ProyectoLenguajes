import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas} from '@fortawesome/free-solid-svg-icons'; // Icono Necesarios solamente
//import { fas } from '@fortawesome/free-solid-svg-icons'; // Libreria Completa
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { Error403Component } from './components/error403/error403.component'; 
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { RefreshTokenInterceptor } from './shared/helpers/refresh-token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    Error403Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    NgxPaginationModule,
    BrowserAnimationsModule,
    
  ],
  providers: [
    //nuevo para el helper
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:RefreshTokenInterceptor,multi:true},
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule {
  constructor(libreria:FaIconLibrary){
    //libreria.addIcons(faPlus,faPencil,faTrash,faInfo,faCircleInfo,faTrashCan,faMagnifyingGlass,faPrint,faCircleXmark,faUser); // Importamos solo lo que ocupamos
    libreria.addIconPacks(fas) // Se importa toda la libreria al importar
  }
}
