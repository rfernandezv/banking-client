import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccountService} from '../../services/bank-account.service';
import {BankAccount} from '../../models/bank-account';
import {Globals} from '../../shared/models/globals';
import {FormControl, Validators} from '@angular/forms';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {RequestBankAccountDto} from '../../models/dto/requestBankAccountDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-baza.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogBankComponent {
  @BlockUI() blockUI: NgBlockUI;
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
    this.dialogRef.close('x');
  }

  confirmEdit(): void {
    this.blockUI.start();
    this.requestBankAccountDto = new RequestBankAccountDto()
        .setId(this.data.id)
        .setNumber(this.data.number)
        .setIsLocked(this.data.isLocked)
        .setBalance(this.data.balance)
        .setCustomerId(this.data.customerId)
    ;

    this._bankAccountService.updateBankAccount(this.data.id, this.requestBankAccountDto).subscribe(
          successData => {              
            this.blockUI.stop();
            
            if(successData.response.httpStatus == '200'){
              this._bankAccountService.dialogData = this.data;
              this._messageAlertHandleService.handleSuccess(successData.response.message);              
              this.dialogRef.close(1);
              
            }else{
              this._bankAccountService.dialogData = null;              
              this._messageAlertHandleService.handleError(successData.response.message);
            }
        },
        error => {
            this._bankAccountService.dialogData = null;
            this.blockUI.stop();
            this._messageAlertHandleService.handleError(error);
        },
        () => {}
     );
  }
}
