import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {FormControl, Validators} from '@angular/forms';
import {Customer} from '../../models/customer';
import {RequestCustomerDto} from '../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../services/message-alert.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})


export class AddDialogComponent {
  requestCustomer: RequestCustomerDto;

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
    this.dialogRef.close();
  }

  public confirmAdd(): void {    

        this.requestCustomer = new RequestCustomerDto()
            .setFirstName(this.data.firstName)
            .setLastName(this.data.lastName)
            .setDocumentNumber(this.data.documentNumber)
            .setBirthDate(this.data.birthDate)
            .setCellphone(this.data.cellphone)
            .setEmail(this.data.email)
            .setIsActive('1')
            .setUser(this.data.user)
            .setPassword(this.data.password)
            .setRolId(2)
        ;
        this._customerService.addCustomer(this.requestCustomer).subscribe({
          error: (err: any) => {
            this._customerService.dialogData = null;

            /////////////////// rfv //////////////////
            this._customerService.dialogData = this.data;
            ////////////////////////////////////////////////

              this._messageAlertHandleService.handleError(err);
          },
          complete: () => {
              this._customerService.dialogData = this.data;
              this._messageAlertHandleService.handleSuccess('Registered successfully');       
          }
        });
  }
}
