import {MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {CustomerService} from '../../services/customer.service';
import {FormControl, Validators} from '@angular/forms';
import {Customer} from '../../models/customer';
import {RequestCustomerDto} from '../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})


export class AddDialogComponent {
  @BlockUI() blockUI: NgBlockUI;
  requestCustomer: RequestCustomerDto; 
  dateCustomer = new Date();

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer,
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

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateCustomer = event.value;
  }

  public confirmAdd(): void {
        this.blockUI.start();
        
        if(this.dateCustomer != null){          
          this.data.birthDate = moment(this.dateCustomer).format('YYYY-MM-DD');
        }        

        this.requestCustomer = new RequestCustomerDto()
            .setFirstName(this.data.firstName)
            .setLastName(this.data.lastName)
            .setDocumentNumber(this.data.documentNumber)
            .setBirthDate(this.data.birthDate)
            .setCellphone(this.data.cellphone)
            .setEmail(this.data.email)
            .setIsActive('true')
            .setUser(this.data.user)
            .setPassword(this.data.password)
            .setRolId(2)
        ;
        
        this._customerService.addCustomer(this.requestCustomer).subscribe(

          successData => {              
              this.blockUI.stop();
              
              if(successData.response.httpStatus == '201'){
                this.updateNewCustomer(this.data.documentNumber);
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

  updateNewCustomer(document : string){
    this._customerService.getCustomerByNumDoc(document).subscribe(
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
