import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { BankAccount } from '../../models/bank-account';
import { Transfer } from '../../models/transfer';
import { Router } from '@angular/router';
import { Globals} from '../../shared/globals';
import { Subscription } from 'rxjs/Subscription';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { TranferService } from '../../services/transfer.service';
import { BankAccountService } from '../../services/bank-account.service';
import { MessageAlertHandleService} from '../../services/message-alert.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSave: boolean = false;
  errorMessage: String;  
  subscription: Subscription = new Subscription();
  private formSubmitAttempt: boolean = false;
  BankAccountsOrigin: BankAccount[] = [];

  constructor(
      public fb: FormBuilder,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<TransferComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Transfer,
      public _tranferService: TranferService,
      public _bankAccountService : BankAccountService,
      public globals : Globals,
      public _messageAlertHandleService: MessageAlertHandleService,
      private router: Router
  ) {}


  ngOnInit() {
    this.reset();
    this.setUpControls();
    this.loadBankAccounts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setUpControls() : void {
      this.form = this.fb.group({
        fromAccountNumber: new FormControl('', [Validators.required, Validators.maxLength(18)] ),
        toAccountNumber: new FormControl('', [Validators.required, Validators.maxLength(18)] ),
        amount: new FormControl('', [Validators.required, Validators.min(0)])
      });
  }
  
  loadBankAccounts() : void{
      this._bankAccountService.getAllBankAccountByCustomerId(this.globals.customer.customerId).subscribe(
        successData => {
          this.BankAccountsOrigin = successData;
        },
        error => {
          this._messageAlertHandleService.handleError("Failed to load resource bank account ");

          //////////// rfv ////////////
          this.BankAccountsOrigin = [
            new BankAccount().setId(1).setNumber('123-456-001').setBalance(1500).setIsLocked(false).setCustomerId(1)
          ];
          ////////////////////////////////////////////////

        },
        () => {
         // everything successful
        }
      );
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
    this.data.fromAccountNumber = null;
    this.data.toAccountNumber = null;
    this.data.amount = null;    
  }

}


