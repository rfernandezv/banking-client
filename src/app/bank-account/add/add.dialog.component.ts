import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccountService} from '../../services/bank-account.service';
import {FormControl, Validators} from '@angular/forms';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {Globals} from '../../shared/models/globals';
import {BankAccount} from '../../models/bank-account';
import {RequestBankAccountDto} from '../../models/dto/requestBankAccountDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})


export class AddDialogBankComponent {
  @BlockUI() blockUI: NgBlockUI;
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
    this.dialogRef.close('x');
  }

  public confirmAdd(): void {    
        
        this.blockUI.start();
        this.data.balance = 0;
        this.data.isLocked = 'false';
        this.requestBankAccountDto = new RequestBankAccountDto()
            .setId(this.data.id)
            .setNumber(this.data.number)
            .setIsLocked(this.data.isLocked )
            .setBalance(this.data.balance)
            .setCustomerId(this.data.customerId)
        ;

        this._bankAccountService.addBankAccount(this.requestBankAccountDto).subscribe(

          successData => {              
              this.blockUI.stop();
              
              if(successData.response.httpStatus == '201'){
                this.updateNewBankAccount(this.data.number);
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

  updateNewBankAccount(accountNumber : string){
    this._bankAccountService.getCustomerByAccountNumber(accountNumber).subscribe(
        successData => {
            if(successData != null){
              this.data.id = successData.id;
            }
        },
        error => {
           console.log(error);
        },
        () => {}
    );
  }
}
