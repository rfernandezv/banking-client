import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {Customer} from '../.././models/customer';
import {Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AddDialogComponent} from '.././add/add.dialog.component';
import {EditDialogComponent} from '.././edit/edit.dialog.component';
import {DeleteDialogComponent} from '.././delete/delete.dialog.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns = ['customerId', 'firstName', 'lastName', 'documentNumber', 'cellphone', 'email', 'actions'];
  customerDataBase: CustomerService | null;
  customerDataSource: CustomerDataSource | null;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public _CustomerService: CustomerService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew(customer: Customer) {
      const dialogRef = this.dialog.open(AddDialogComponent, {
        data: {customer: customer }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
            if(this._CustomerService.getDialogData() != null){
              this.customerDataBase.dataChange.value.push(this._CustomerService.getDialogData());
              this.refreshTable();
            }          
        }
      });
  }


  startEdit(i: number, customerId: number, firstName: string, lastName: string, documentNumber: string, cellphone: string, email: string) {
      this.id = customerId;
      this.index = i;
      console.log(this.index);
      const dialogRef = this.dialog.open(EditDialogComponent, {
        data: {customerId: customerId, firstName: firstName, lastName: lastName, documentNumber: documentNumber, cellphone: cellphone, email: email}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          const foundIndex = this.customerDataBase.dataChange.value.findIndex(x => x.customerId === this.id);
          this.customerDataBase.dataChange.value[foundIndex] = this._CustomerService.getDialogData();
          this.refreshTable();
        }
      });
  }


  deleteItem(i: number, customerId: number, firstName: string, lastName: string, documentNumber: string) {
      this.index = i;
      this.id = customerId;
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {customerId: customerId, firstName: firstName, lastName: lastName, documentNumber: documentNumber}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          const foundIndex = this.customerDataBase.dataChange.value.findIndex(x => x.customerId === this.id);
          this.customerDataBase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
        }
      });
  }


  private refreshTable() {
      if (this.customerDataSource._paginator.hasNextPage()) {
        this.customerDataSource._paginator.nextPage();
        this.customerDataSource._paginator.previousPage();
      } else if (this.customerDataSource._paginator.hasPreviousPage()) {
        this.customerDataSource._paginator.previousPage();
        this.customerDataSource._paginator.nextPage();
      } else {
        this.customerDataSource.filter = '';
        this.customerDataSource.filter = this.filter.nativeElement.value;
      }
  }


  public loadData() {
    this.customerDataBase = new CustomerService(this.httpClient);
    this.customerDataSource = new CustomerDataSource(this.customerDataBase, this.paginator, this.sort);

    
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.customerDataSource) {
            return;
          }
          this.customerDataSource.filter = this.filter.nativeElement.value;
        });      
  }

}


export class CustomerDataSource extends DataSource<Customer> {
  _filterChange = new BehaviorSubject('');
  searchStr : string;

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Customer[] = [];
  renderedData: Customer[] = [];

  constructor(public _customerDatabase: CustomerService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Customer[]> {
        const displayDataChanges = [
          this._customerDatabase.dataChange,
          this._sort.sortChange,
          this._filterChange,
          this._paginator.page
        ];

        this._customerDatabase.getAllCustomers();

        this.filteredData = this._customerDatabase.data.slice().filter((customer: Customer) => {
          const searchStr = (customer.firstName + customer.lastName + customer.documentNumber).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        const sortedData = this.sortData(this.filteredData.slice());

        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

        return Observable.merge(...displayDataChanges).map(() => {
          this.filteredData = this._customerDatabase.data.slice().filter((customer: Customer) => {
            if(customer.customerId == undefined){
              this.searchStr = '';
            }else{
              this.searchStr = (customer.firstName + customer.lastName + customer.documentNumber).toLowerCase();
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

    sortData(data: Customer[]): Customer[] {
        if (!this._sort.active || this._sort.direction === '') {
          return data;
        }

        return data.sort((a, b) => {
          let propertyA: number | string = '';
          let propertyB: number | string = '';

          switch (this._sort.active) {
            case 'customerId': [propertyA, propertyB] = [a.customerId, b.customerId]; break;
            case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
            case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
            case 'documentNumber': [propertyA, propertyB] = [a.documentNumber, b.documentNumber]; break;
            case 'cellphone': [propertyA, propertyB] = [a.cellphone, b.cellphone]; break;
            case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
          }

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
