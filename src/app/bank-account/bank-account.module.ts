import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TransferComponent } from './transfer/transfer.component';
import { HttpClientModule} from '@angular/common/http';
import { TranferService } from '../services/transfer.service';
import { BankAccountService } from '../services/bank-account.service';
import { MessageAlertHandleService} from '../services/message-alert.service';

import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule, MatSelectModule,
} from '@angular/material';

import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AuthGuard } from '../services/auth/auth.guard';
import { AuthService } from '../services/auth/auth.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSelectModule
    
  ],
  providers: [
    AuthService, AuthGuard
  ],
  declarations: [ListComponent, TransferComponent]
})
export class BankAccountModule { }
