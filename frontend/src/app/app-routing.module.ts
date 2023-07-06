import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { RolModel } from './shared/models/roles.model';
import { Error403Component } from './components/error403/error403.component';
import { loginGuard } from './shared/guards/login.guard';
import { RolComponent } from './components/rol/rol.component';
import { PersonComponent } from './components/person/person.component';
import { ProductComponent } from './components/product/product.component';
import { ClassificationComponent } from './components/classification/classification.component';
import { BillsComponent } from './components/bills/bills.component';
import { CustomerComponent } from './components/customer/customer.component';
import { DetailsComponent } from './components/details/details.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { rolAux } from './shared/models/rolAux.model';
import { CambioPassComponent } from './components/cambio-pass/cambio-pass.component';

//nuev

const routes: Routes = [
  {path: '', pathMatch: 'full',redirectTo: '/login'},
  {path: 'login', component: LoginComponent, canActivate: [loginGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'error403', component: Error403Component},
  {path: 'rol', component: RolComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'person', component: PersonComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'product', component: ProductComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin, rolAux.Bodeguero]}},
  {path: 'classification', component: ClassificationComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'bills', component: BillsComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'customer', component: CustomerComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'details', component: DetailsComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin, rolAux.Vendendor]}},
  {path: 'warehouse', component: WarehouseComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin, rolAux.Bodeguero]}},
  {path: 'supplier', component: SupplierComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin]}},
  {path: 'changePassword', component: CambioPassComponent,canActivate:[authGuard],data:{roles:[rolAux.Admin, rolAux.Bodeguero, rolAux.Vendendor]}}, 
  {path: '**', redirectTo: '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
