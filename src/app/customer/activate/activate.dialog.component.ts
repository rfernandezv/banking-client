import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {MessageAlertHandleService} from '../../services/message-alert.service';
import { RequestCustomerDto } from '../../models/dto/requestCustomerDto';


@Component({
  selector: 'app-activate.dialog',
  templateUrl: './activate.dialog.html',
  styleUrls: ['./activate.dialog.css']
})
export class ActivateDialogComponent {
  @BlockUI() blockUI: NgBlockUI;
  requestCustomer: RequestCustomerDto;

  constructor(public dialogRef: MatDialogRef<ActivateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer, 
              public _messageAlertHandleService: MessageAlertHandleService,
              public _customerService: CustomerService) { }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  confirmAtivate(): void {
    this.blockUI.start();    
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
          .setRolId(this.data.id_rol)
      ;

    this._customerService.updateCustomer(this.data.id, this.requestCustomer).subscribe(
        successData => {              
            this.blockUI.stop();
            
            if(successData.response.httpStatus == '200'){
              this.data.isActive = 'true';
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
