import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccountService} from '../../services/bank-account.service';
import {BankAccount} from '../../models/bank-account';
import {Globals} from '../../shared/globals';
import {FormControl, Validators} from '@angular/forms';
import {RequestBankAccountDto} from '../../models/dto/requestBankAccountDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-baza.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogBankComponent {
  requestBankAccountDto: RequestBankAccountDto;

  constructor(public dialogRef: MatDialogRef<EditDialogBankComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BankAccount, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public globals : Globals,
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

  confirmEdit(): void {
    this.requestBankAccountDto = new RequestBankAccountDto()
        .setId(this.data.id)
        .setNumber(this.data.number)
        .setIsLocked(this.data.isLocked)
        .setBalance(this.data.balance)
        .setCustomerId(this.globals.customer.id)
    ;

    this._bankAccountService.updateBankAccount(this.data.id, this.requestBankAccountDto).subscribe({
      error: (err: any) => {
          this._bankAccountService.dialogData = null;

            //////////// rfv  ////////////
            this._bankAccountService.dialogData = this.data;
            ////////////////////////

          this._messageAlertHandleService.handleError(err);
      },
      complete: () => {
          this._bankAccountService.dialogData = this.data;
          this._messageAlertHandleService.handleSuccess('Updated successfully');       
      }
    });
  }
}
