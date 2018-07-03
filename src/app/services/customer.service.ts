import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../models/customer';
import {RequestCustomerDto} from '../models/dto/requestCustomerDto';
import {ResponseService} from '../models/response';
import {HttpOptionsConst} from '../shared/http-options';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class CustomerService {
  API_URL : string = environment.apiUrlJava + 'customer';

  dataChange: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  dialogData: Customer;  

  constructor (private httpClient: HttpClient) {}

  get data(): Customer[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllCustomers(): void {
    this.httpClient.get<Customer[]>(this.API_URL).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
          console.log (error.name + ' ' + error.message);
      });
  }

  addCustomer (requestCustomerDto: RequestCustomerDto): Observable<ResponseService> {

    return this.httpClient
            .post(this.API_URL, requestCustomerDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateCustomer (customerId : number, requestCustomerDto: RequestCustomerDto): Observable<ResponseService> {
    return this.httpClient
            .put(this.API_URL + '/'+ customerId, requestCustomerDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteCustomer (customerId: number): Observable<ResponseService> {
    return this.httpClient
          .delete(this.API_URL + '/'+ customerId, HttpOptionsConst)
          .map(
              res => res
            )
          .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}



/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




