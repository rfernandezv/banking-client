import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';
import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule, MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material';
import { ToastModule } from 'ng2-toastr';
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
import { TransfersDialog } from './bank-account/transfer/transfer.component';
import { DataService} from './services/issue.service';
import { TranferDataService} from './services/transfer.service';
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
    TransfersDialog  
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    TransfersDialog
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

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule

  ],
  providers: [AuthService, AuthGuard, DataService, TranferDataService, MessageAlertHandleService, 
    {
    provide: MatDialogRef,
    useValue: {}
  }, {
    provide: MAT_DIALOG_DATA,
    useValue: {} // Add any data you wish to test if it is passed/used correctly
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
