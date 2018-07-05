import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {BankAccount} from '../models/bank-account';
import {RequestBankAccountDto} from '../models/dto/requestBankAccountDto';
import {ResponseService} from '../models/response';
import {HttpOptionsConst} from '../shared/http-options';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class BankAccountService {
  API_URL : string = environment.apiUrl + 'Accounts';

  dataChange: BehaviorSubject<BankAccount[]> = new BehaviorSubject<BankAccount[]>([]);
  dialogData: BankAccount;
  listaTemporal : BankAccount[];

  constructor (private httpClient: HttpClient) {}

  get data(): BankAccount[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllBankAccount(): void {
    this.httpClient.get<BankAccount[]>(this.API_URL+'/bankAccount').subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {

        ////// rfv //////
        this.listaTemporal = [
          new BankAccount().setId(1).setNumber('123-001').setBalance(0).setCustomerId(1).setIsLocked(false),
          new BankAccount().setId(2).setNumber('123-002').setBalance(1000).setCustomerId(2).setIsLocked(true)
        ];      
        this.dataChange.next(this.listaTemporal);
        //////////////////////////////
        
          console.log (error.name + ' ' + error.message);
      });
  }

  getAllBankAccountByCustomerId (customerId : number): Observable<BankAccount[]> {
    return this.httpClient
            .get<BankAccount[]>(this.API_URL+'/getAccountIdCustomer/'+customerId, HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addBankAccount (requestBankAccountDto: RequestBankAccountDto): Observable<ResponseService> {

    return this.httpClient
            .post(this.API_URL, requestBankAccountDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateBankAccount (bankAccountId : number, requestBankAccountDto: RequestBankAccountDto): Observable<ResponseService> {
    return this.httpClient
            .put(this.API_URL + '/'+ bankAccountId, requestBankAccountDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteBankAccount (bankAccountId: number): Observable<ResponseService> {
    return this.httpClient
          .delete(this.API_URL + '/'+ bankAccountId, HttpOptionsConst)
          .map(
              res => res
            )
          .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
