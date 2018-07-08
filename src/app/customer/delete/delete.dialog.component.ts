import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.css']
})
export class DeleteDialogComponent {
  @BlockUI() blockUI: NgBlockUI;

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public _customerService: CustomerService) { }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  confirmDelete(): void {
    this.blockUI.start();

    this._customerService.deleteCustomer(this.data.id).subscribe(      
        successData => {
          this.blockUI.stop();

          if(successData.response.httpStatus == '200'){
              this.data.isActive = 'false';
              this._customerService.dialogData = this.data;
              this._messageAlertHandleService.handleSuccess(successData.response.message);
              this.dialogRef.close(1);
          }else{
            this._customerService.dialogData = null;
            this._messageAlertHandleService.handleError(successData.response.message);
          }
      },
      error => {          
          this._customerService.dialogData = null;
          this.blockUI.stop();
          this._messageAlertHandleService.handleError(error);
      },
      () => {}
    );
  }
}
