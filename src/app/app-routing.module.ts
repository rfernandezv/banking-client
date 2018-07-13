import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './customer/list/list.component';
import { ListComponent as ListBankAccountComponent } from './bank-account/list/list.component';
import { TransferComponent } from './bank-account/transfer/transfer.component';
import { CustomerModule } from './customer/customer.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { CurrentOptionComponent } from './current-option/current-option.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'customer/list', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'bank-account/list', component: ListBankAccountComponent, canActivate: [AuthGuard] },
  { path: 'bank-account/transfer', component: TransferComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]}
];

@NgModule({
  imports: [    
    RouterModule.forRoot(routes)
  ],
  exports: [
    CustomerModule,
    BankAccountModule,
    RouterModule, CustomerModule
  ]
})
export class AppRoutingModule { }

