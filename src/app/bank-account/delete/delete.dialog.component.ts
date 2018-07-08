import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccount} from '../../models/bank-account';
import {BankAccountService} from '../../services/bank-account.service';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.css']
})
export class DeleteDialogBankComponent {
  @BlockUI() blockUI: NgBlockUI;

  constructor(public dialogRef: MatDialogRef<DeleteDialogBankComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BankAccount, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public _bankAccountService: BankAccountService) { }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  getDescriptionIsLocked(isLocked : string) : string{
    return (isLocked == 'true')?'Yes':'No';
  }

  confirmDelete(): void {
    this.blockUI.start();

    this._bankAccountService.deleteBankAccount(this.data.id).subscribe(
        successData => {
          this.blockUI.stop();

          if(successData.response.httpStatus == '200'){
              this.data.isLocked = 'false';
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
