import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListComponent } from './customer/list/list.component';
import { ListComponent as ListBankAccountComponent } from './bank-account/list/list.component';
import { TransferComponent } from './bank-account/transfer/transfer.component';
import { CustomerModule } from './customer/customer.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { CurrentOptionComponent } from './current-option/current-option.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },  
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'customer/list', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'bank-account/list', component: ListBankAccountComponent, canActivate: [AuthGuard] },
  { path: 'bank-account/transfer', component: TransferComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuard]}
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

