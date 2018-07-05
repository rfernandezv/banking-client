import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer';
import {FormControl, Validators} from '@angular/forms';
import {RequestCustomerDto} from '../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-baza.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogComponent {
  requestCustomer: RequestCustomerDto;

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
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
    this.dialogRef.close();
  }

  confirmEdit(): void {
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

    this._customerService.updateCustomer(this.data.customerId, this.requestCustomer).subscribe({
      error: (err: any) => {
          this._customerService.dialogData = null;

          //////////////////// rfv ////////////////////
          this._customerService.dialogData = this.data;
          ////////////////////////////////////////////

          this._messageAlertHandleService.handleError(err);
      },
      complete: () => {
          this._customerService.dialogData = this.data;
          this._messageAlertHandleService.handleSuccess('Updated successfully');       
      }
    });
  }
}
