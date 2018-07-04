import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BankAccount} from '../../models/bank-account';
import {BankAccountService} from '../../services/bank-account.service';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.css']
})
export class DeleteDialogBankComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogBankComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BankAccount, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public _bankAccountService: BankAccountService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getDescriptionIsLocked(isLocked : boolean) : string{
    return (isLocked)?'Yes':'No';
  }

  confirmDelete(): void {
    this._bankAccountService.deleteBankAccount(this.data.id).subscribe({
      error: (err: any) => {
          this._messageAlertHandleService.handleError(err);
      },
      complete: () => {
          this._messageAlertHandleService.handleSuccess('Deleted successfully');       
      }
    });
  }
}
