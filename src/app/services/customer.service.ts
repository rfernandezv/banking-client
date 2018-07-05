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
  API_URL : string = environment.apiUrl + 'Customers';

  dataChange: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  dialogData: Customer; 
  listaTemporal : Customer[];

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

          ////// rfv //////
        this.listaTemporal = [
          new Customer().setCustomerId(1).setFirstName('Marvin').setLastName('Fernandez').setIsActive('1').setRolId(1).setDocumentNumber('47288664').setCellphone('987654321'),
          new Customer().setCustomerId(2).setFirstName('Jhonatan').setLastName('Tirado').setIsActive('1').setRolId(1).setDocumentNumber('12345678'),
          new Customer().setCustomerId(3).setFirstName('Gustavo').setLastName('Osorio').setIsActive('0').setRolId(2).setDocumentNumber('87654321').setEmail('correo@ads.com'),
          new Customer().setCustomerId(4).setFirstName('Richard').setLastName('Fernandez').setIsActive('1').setRolId(2).setDocumentNumber('11223344')          
        ];      
        this.dataChange.next(this.listaTemporal);
        //////////////////////////////

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