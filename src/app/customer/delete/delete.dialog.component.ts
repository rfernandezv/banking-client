import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.css']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public _customerService: CustomerService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this._customerService.deleteCustomer(this.data.customerId).subscribe({
      error: (err: any) => {
          this._messageAlertHandleService.handleError(err);
      },
      complete: () => {
          this._messageAlertHandleService.handleSuccess('Registered successfully');       
      }
    });
  }
}
