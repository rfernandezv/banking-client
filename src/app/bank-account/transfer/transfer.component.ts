import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { BankAccount } from '../../models/bank-account';
import { Transfer } from '../../models/transfer';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ResponseService } from '../../models/response';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { TranferService } from '../../services/transfer.service';
import { MessageAlertHandleService} from '../../services/message-alert.service';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSave: boolean = false;
  responseAPI = new ResponseService();
  errorMessage: String;
  subscription: Subscription = new Subscription();
  private formSubmitAttempt: boolean = false;

  BankAccountsOrigin: BankAccount[] = [
    {id: 1, number: '123-456-001', balance: 1500, isLocked: false, customerId: 1, customerName:'Richar'}    
  ];

  BankAccountsDestination: BankAccount[] = [
    {id: 2, number: '123-456-002', balance: 1800, isLocked: false, customerId: 2, customerName:'Richar'}
  ];

  constructor(
      public fb: FormBuilder,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<TransferComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Transfer,
      public _tranferService: TranferService,
      public _messageAlertHandleService: MessageAlertHandleService,
      private router: Router
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(TransfersDialog, {
      width: '250px',
      data: {name: this.responseAPI.message}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {
    this.reset();   
    this.form = this.fb.group({
      fromAccountNumber: ['', Validators.required],
      toAccountNumber: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isFieldInvalid(field: string) {
    if(this.isSave){
      return false;
    }
    return (
      (!this.form.get(field).valid && this.form.get(field).touched ) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    this.formSubmitAttempt = true;
    this.isSave = false;
    if (this.form.valid) {
      this.newTransferAccount(this.data);
    }
  }

  newTransferAccount(transfer: Transfer) : void {

    let transferSuscription = this._tranferService.newTransferAccount(transfer).subscribe({
      error: (err: any) => {
          this._messageAlertHandleService.handleError(err);
      },
      complete: () => {
          this._messageAlertHandleService.handleSuccess('Process complete successfully');       
          this.form.reset();
      }
    });
    this.subscription.add(transferSuscription);
  }

  private reset() {
    //this.data.fromAccountNumber = null;	 
    this.data.toAccountNumber = null;
    this.data.amount = null;    
  }

}

@Component({
  selector: 'transfer-dialog',
  templateUrl: 'transfer.dialog.html',
})
export class TransfersDialog {

  constructor(
    public dialogRef: MatDialogRef<TransfersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  name: string;
}

