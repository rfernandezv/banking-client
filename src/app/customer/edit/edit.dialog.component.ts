import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer';
import {Globals} from '../../shared/models/globals';
import {FormControl, Validators} from '@angular/forms';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {RequestCustomerDto} from '../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';
import * as HttpStatus from 'http-status-codes'

@Component({
  selector: 'app-baza.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogComponent {
  @BlockUI() blockUI: NgBlockUI;
  requestCustomer: RequestCustomerDto;

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer,
              public globals : Globals,
              public _messageAlertHandleService: MessageAlertHandleService,
              public _customerService: CustomerService) { }

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
      this.requestCustomer = new RequestCustomerDto()
          .setFirstName(this.data.firstName)
          .setLastName(this.data.lastName)
          .setDocumentNumber(this.data.documentNumber)
          .setBirthDate(this.data.birthDate)
          .setCellphone(this.data.cellphone)
          .setEmail(this.data.email)
          .setIsActive(this.data.isActive)
          .setUser(this.data.user)
          .setPassword(this.data.password)
          .setRolId(this.data.id_rol)
      ;

    this._customerService.updateCustomer(this.data.id, this.requestCustomer).subscribe(
        successData => {              
            this.blockUI.stop();
            
            if(successData.response.httpStatus == HttpStatus.OK.toString()){
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
