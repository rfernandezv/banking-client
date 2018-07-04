import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccountService} from '../../services/bank-account.service';
import {FormControl, Validators} from '@angular/forms';
import {Globals} from '../../shared/globals';
import {BankAccount} from '../../models/bank-account';
import {RequestBankAccountDto} from '../../models/dto/requestBankAccountDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})


export class AddDialogBankComponent {
  requestBankAccountDto: RequestBankAccountDto;

  constructor(public dialogRef: MatDialogRef<AddDialogBankComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BankAccount,
              public globals : Globals,
              public _messageAlertHandleService: MessageAlertHandleService,
              public _bankAccountService: BankAccountService) { }

  formControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {    

        this.requestBankAccountDto = new RequestBankAccountDto()
            .setId(this.data.id)
            .setNumber(this.data.number)
            .setIsLocked(this.data.isLocked)
            .setBalance(0)
            .setCustomerId(this.globals.customer.customerId)
        ;
        this.data.balance = 0;

        this._bankAccountService.addBankAccount(this.requestBankAccountDto).subscribe({
          error: (err: any) => {
            this._bankAccountService.dialogData = null;

            //////////// rfv  ////////////
            this._bankAccountService.dialogData = this.data;
            ////////////////////////

              this._messageAlertHandleService.handleError(err);
          },
          complete: () => {
              this._bankAccountService.dialogData = this.data;
              this._messageAlertHandleService.handleSuccess('Registered successfully');       
          }
        });

  }
}
