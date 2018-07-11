import {Component, ElementRef, OnInit, ViewChild, Inject} from '@angular/core';
import {BankAccountService} from '../../services/bank-account.service';
import {CustomerService} from '../../services/customer.service';
import {MessageAlertHandleService} from '../../services/message-alert.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {BankAccount} from '../.././models/bank-account';
import {Customer} from '../.././models/customer';
import {Globals} from '../../shared/globals';
import {Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AddDialogBankComponent} from '../add/add.dialog.component';
import {EditDialogBankComponent} from '../edit/edit.dialog.component';
import {DeleteDialogBankComponent} from '../delete/delete.dialog.component';
import {ActivateDialogBankComponent} from '../activate/activate.dialog.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  displayedColumns = ['id', 'number', 'balance', 'isLocked','actions'];
  bankAccountDataBase: BankAccountService | null;
  bankAccountDataSource: BankAccountDataSource | null;
  form: FormGroup;
  customerSearch : Customer = new Customer().setId(0);
  documentoNumberSearch : string;
  formSubmitAttempt: boolean = false;
  searchCompleted : boolean;
  index: number;
  id: number;
  pageEvent: PageEvent;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public globals : Globals,
              public fb: FormBuilder,
              public _customerService : CustomerService,
              public _bankAccountService: BankAccountService,
              public _messageAlertHandleService: MessageAlertHandleService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {    
      this.reset();
      this.setUpControls();
      this.loadData();
  }

  refresh() {
    this.loadData();
  }

  reset(){
      this.searchCompleted = false;
      this.documentoNumberSearch = '';
  }

  setUpControls(){
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.form = this.fb.group({
        documentNumber: new FormControl('', [Validators.required, Validators.maxLength(9)] )
      });
  }

  isFieldInvalid(field: string) {
      return (
        (!this.form.get(field).valid && this.form.get(field).touched ) ||
        (this.form.get(field).untouched && this.formSubmitAttempt)
      );
}

  onSubmit() {
      this.formSubmitAttempt = true;
      if (this.form.valid) {
          this.searchCustomerByNumDoc(this.documentoNumberSearch);
      }
  }

  searchCustomerByNumDoc(document : string){
      this.searchCompleted = false;
      this._customerService.getCustomerByNumDoc(document).subscribe(
          successData => {              
              if(successData != null){
                this.customerSearch = successData;
                this.searchCompleted = true;                
                this._messageAlertHandleService.handleSuccess('Customer found');
              }else{
                this.customerSearch = new Customer().setId(0);
                this._messageAlertHandleService.handleError('Customer not found');
              }
              this.loadData();
          },
          error => {
              this.customerSearch = new Customer().setId(0);
              this._messageAlertHandleService.handleError(error);
          },
          () => {}
      );
  }

  getDescriptionIsLocked(isLocked : boolean) : string{
    return (isLocked)?'Yes':'No';
  }

  addNew(bankAccount: BankAccount) {
      
      const dialogRef = this.dialog.open(AddDialogBankComponent, {
        data: {number : '',               
               customerId : this.customerSearch.id
             }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
            if(this._bankAccountService.getDialogData() != null){
              this.bankAccountDataBase.dataChange.value.push(this._bankAccountService.getDialogData());
              this.refreshTable();
            }          
        }
      });
  }

  startEdit(i: number, bankAccount : BankAccount) {
        this.index = i;
        this.id = bankAccount.id;
        const dialogRef = this.dialog.open(EditDialogBankComponent, {
          data: {id: bankAccount.id, 
                number: bankAccount.number, 
                isLocked: bankAccount.isLocked, 
                balance : bankAccount.balance,
                customerId : bankAccount.customerId            
              }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            if(this._bankAccountService.getDialogData() != null){
                const foundIndex = this.bankAccountDataBase.dataChange.value.findIndex(x => x.id === this.id);
                this.bankAccountDataBase.dataChange.value[foundIndex] = this._bankAccountService.getDialogData();
                this.refreshTable();
            }        
          }
        });
  }


 deleteItem(i: number, bankAccount : BankAccount) {
        this.index = i;
        this.id = bankAccount.id;
        const dialogRef = this.dialog.open(DeleteDialogBankComponent, {
          data: {id: bankAccount.id, 
                number: bankAccount.number, 
                isLocked: bankAccount.isLocked, 
                balance : bankAccount.balance,
                customerId : bankAccount.customerId            
              }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            if(this._bankAccountService.getDialogData() != null){
                const foundIndex = this.bankAccountDataBase.dataChange.value.findIndex(x => x.id === this.id);
                this.bankAccountDataBase.dataChange.value[foundIndex] = this._bankAccountService.getDialogData();
                this.refreshTable();
            }        
          }
        });
  }


  activateItem(i: number, bankAccount : BankAccount) {
      this.index = i;
      this.id = bankAccount.id;
      const dialogRef = this.dialog.open(ActivateDialogBankComponent, {
        data: {id: bankAccount.id, 
              number: bankAccount.number, 
              isLocked: bankAccount.isLocked, 
              balance : bankAccount.balance,
              customerId : bankAccount.customerId            
            }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          if(this._bankAccountService.getDialogData() != null){
              const foundIndex = this.bankAccountDataBase.dataChange.value.findIndex(x => x.id === this.id);
              this.bankAccountDataBase.dataChange.value[foundIndex] = this._bankAccountService.getDialogData();
              this.refreshTable();
          }        
        }
      });
  }

  private refreshTable() {
    this.blockUI.start();
    this.bankAccountDataSource.connect();
    this.blockUI.stop();
  }


  public loadData() {
      this.blockUI.start();
      this.bankAccountDataBase = new BankAccountService(this.httpClient);
      this.bankAccountDataSource = new BankAccountDataSource(this.bankAccountDataBase, this.paginator, this.globals, this.sort, this.customerSearch);
      
      if(this.filter.nativeElement != undefined){
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
                .debounceTime(150)
                .distinctUntilChanged()
                .subscribe(() => {
                  if (!this.bankAccountDataSource) {
                    return;
                  }
                  this.bankAccountDataSource.filter = this.filter.nativeElement.value;
                });
      } 
      this.blockUI.stop();
  }

  public handlePage(e: any) {
    this.blockUI.start();

    this.bankAccountDataSource.pageIndex = e.pageIndex;
    this.bankAccountDataSource.pageSize = e.pageSize;
    this.bankAccountDataSource.connect();

    this.blockUI.stop();
  }

}


export class BankAccountDataSource extends DataSource<BankAccount> {
  _filterChange = new BehaviorSubject('');
  searchStr : string;
  lengthPage : number = 0;  
  pageIndex : number = 0;
  pageSize : number = 20;

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: BankAccount[] = [];
  renderedData: BankAccount[] = [];

  constructor(public _bankAccountDatabase: BankAccountService,
              public _paginator: MatPaginator,              
              public globals : Globals,
              public _sort: MatSort,
              public _customerSearched : Customer) {
      super();
      if(this._filterChange != undefined){
          this._filterChange.subscribe(
                  () => {
                    if(this._paginator != undefined){
                      this._paginator.pageIndex = 0;
                    }
                  }
            );
      }
  }

  connect(): Observable<BankAccount[]> {
        const displayDataChanges = [
          this._bankAccountDatabase.dataChange,
          this._bankAccountDatabase.totalSize,
          this._sort.sortChange,
          this._filterChange,
          this._paginator.page
        ];

        this._bankAccountDatabase.getAllBankAccountByCustomerIdView(this._customerSearched.id);
        
            this.filteredData = this._bankAccountDatabase.data.slice().filter((bankAccount : BankAccount) => {
              const searchStr = (bankAccount.number).toLowerCase();
              return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            const sortedData = this.sortData(this.filteredData.slice());

            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

            return Observable.merge(...displayDataChanges).map(() => {
              this.filteredData = this._bankAccountDatabase.data.slice().filter((bankAccount : BankAccount) => {
                if(bankAccount == undefined || bankAccount.id == undefined){
                  this.searchStr = '';
                }else{
                  this.searchStr = (bankAccount.number).toLowerCase();
                }            
                return this.searchStr.indexOf(this.filter.toLowerCase()) !== -1;
              });

              const sortedData = this.sortData(this.filteredData.slice());

              const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
              this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
              return this.renderedData;
            });
     
    }

    disconnect() {
    }

    sortData(data: BankAccount[]): BankAccount[] {
        if (!this._sort.active || this._sort.direction === '') {
          return data;
        }

        return data.sort((a, b) => {
          let propertyA: number | string = '';
          let propertyB: number | string = '';
          let propertyC: boolean;
          let propertyD: boolean;

          switch (this._sort.active) {
            case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
            case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
            case 'balance': [propertyA, propertyB] = [a.balance, b.balance]; break;
            case 'isLocked': [propertyA, propertyB] = [a.isLocked, b.isLocked]; break;
            case 'customerId': [propertyA, propertyB] = [a.customerId, b.customerId]; break;
          }

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}