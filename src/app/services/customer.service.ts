import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../models/customer';
import {ResponseApi} from '../models/dto/responseApi';
import {RequestCustomerDto} from '../models/dto/requestCustomerDto';
import {HttpOptionsConst} from '../shared/http-options';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ResponseAllCustomersDto } from '../models/dto/responseAllCustomersDto';

@Injectable()
export class CustomerService {
  API_URL : string = environment.apiUrl + 'Customers';

  dataChange: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  dialogData: Customer; 
  totalSize : BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor (private httpClient: HttpClient) {}
  

  getCustomerByNumDoc (numDoc : string): Observable<Customer> {
      return this.httpClient.get<Customer>(this.API_URL+'/findByDocumentNumber?documentNumber='+numDoc)
              .map(data => data)
              .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addCustomer (requestCustomerDto: RequestCustomerDto): Observable<ResponseApi> {
    return this.httpClient
            .post(this.API_URL+'/customer', requestCustomerDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateCustomer (id : number, requestCustomerDto: RequestCustomerDto): Observable<ResponseApi> {
    return this.httpClient
            .put(this.API_URL + '/customer/'+ id, requestCustomerDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteCustomer (id: number): Observable<ResponseApi> {
    return this.httpClient
          .delete(this.API_URL + '/customer/'+ id, HttpOptionsConst)
          .map(
              res => res
            )
          .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getAllCustomersByLimit(offset : number, limit : number): void {
    this.httpClient.get<ResponseAllCustomersDto>(this.API_URL+'/customer?offset='+offset+'&limit='+limit).subscribe(data => {
        this.totalSize.next(data.totalRecords);
        this.dataChange.next(data.content);
      },
      (error: HttpErrorResponse) => {
          console.log (error.name + ' ' + error.message);
       });
  }
  
  get data(): Customer[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getTotalSize() : number{
      return this.totalSize.value;
  }

  
}