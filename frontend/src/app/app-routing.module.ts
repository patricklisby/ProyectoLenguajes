import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { Roles } from './shared/models/roles';
import { Error403Component } from './components/error403/error403.component';
import { loginGuard } from './shared/guards/login.guard';

//nuev

const routes: Routes = [
  {path: '', pathMatch: 'full',redirectTo: '/login'},
  {path: 'login', component: LoginComponent, canActivate: [loginGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'error403', component: Error403Component},
  {path: 'cliente', component: ClienteComponent,canActivate:[authGuard],data:{roles:[Roles.Admin, Roles.Oficinista,Roles.Cliente]}},
  {path: '**', redirectTo: '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
