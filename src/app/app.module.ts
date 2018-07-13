import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor} from './shared/security/httpInterceptor';

import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, 
  MatCheckboxModule, MatTableModule, MatToolbarModule, MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material';
import { ToastModule } from 'ng2-toastr';
import { BlockUIModule } from 'ng-block-ui';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CurrentOptionComponent } from './current-option/current-option.component';
import { AddDialogComponent} from './customer/add/add.dialog.component';
import { EditDialogComponent} from './customer/edit/edit.dialog.component';
import { DeleteDialogComponent} from './customer/delete/delete.dialog.component';
import { ActivateDialogComponent} from './customer/activate/activate.dialog.component';
import { AddDialogBankComponent} from './bank-account/add/add.dialog.component';
import { EditDialogBankComponent} from './bank-account/edit/edit.dialog.component';
import { DeleteDialogBankComponent} from './bank-account/delete/delete.dialog.component';
import { ActivateDialogBankComponent} from './bank-account/activate/activate.dialog.component';
import { TranferService} from './services/transfer.service';
import { CustomerService} from './services/customer.service';
import { BankAccountService} from './services/bank-account.service';
import { Globals} from './shared/models/globals';
import { MessageAlertHandleService} from './services/message-alert.service';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    CurrentOptionComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    ActivateDialogComponent,
    AddDialogBankComponent,
    EditDialogBankComponent,
    DeleteDialogBankComponent,
    ActivateDialogBankComponent
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    ActivateDialogComponent,
    AddDialogBankComponent,
    EditDialogBankComponent,
    DeleteDialogBankComponent,
    ActivateDialogBankComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    BlockUIModule.forRoot(
      {
        message: 'Please wait...'
      }
    ),

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    MatDatepickerModule
  ],
  providers: [
    AuthService, AuthGuard, TranferService, CustomerService, BankAccountService, MessageAlertHandleService, Globals,
     { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    } ,
    { provide: MatDialogRef, useValue: {} }, 
    { provide: MAT_DIALOG_DATA, useValue: {}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
