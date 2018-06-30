import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TransferComponent } from './transfer/transfer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ListComponent, TransferComponent]
})
export class BankAccountModule { }
