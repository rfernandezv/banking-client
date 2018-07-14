import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {BankAccount} from '../models/bank-account';
import {RequestBankAccountDto} from '../models/dto/requestBankAccountDto';
import {ResponseApi} from '../models/dto/responseApi';
import {HttpOptionsConst} from '../shared/models/http-options';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ResponseAllBankAccountDto } from '../models/dto/responseAllBankAccountDto';
import { MessageAlertHandleService } from './message-alert.service';

@Injectable()
export class BankAccountService {
  API_URL : string = environment.apiUrl + 'Accounts';

  dataChange: BehaviorSubject<BankAccount[]> = new BehaviorSubject<BankAccount[]>([]);
  dialogData: BankAccount;
  totalSize : BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor (private httpClient: HttpClient,
              public _messageAlertHandleService: MessageAlertHandleService
              ) {}
  
  getAllBankAccount(): void {
    this.httpClient.get<ResponseAllBankAccountDto>(this.API_URL+'/bankAccount?offset=1&limit=20').subscribe(data => {
        this.dataChange.next(data.content);
      },
      (error: HttpErrorResponse) => {
          this._messageAlertHandleService.handleError(error);
      });
  }

  getAllBankAccountByCustomerIdView(customerId : number): void {
     this.httpClient
            .get<BankAccount[]>(this.API_URL+'/customer/'+customerId, HttpOptionsConst).subscribe(
              data => {
                this.dataChange.next(data);
              },
              (error: HttpErrorResponse) => {
                this._messageAlertHandleService.handleError(error);
              }
          );
  }

  getAllBankAccountByCustomerId (customerId : number): Observable<BankAccount[]> {
    return this.httpClient
            .get<BankAccount[]>(this.API_URL+'/customer/'+customerId, HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getCustomerByAccountNumber (accountNumber : string): Observable<BankAccount> {
    return this.httpClient.get<BankAccount>(this.API_URL+'/findByAccountNumber?accountNumber='+accountNumber)
            .map(data => data)
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addBankAccount (requestBankAccountDto: RequestBankAccountDto): Observable<ResponseApi> {
    return this.httpClient
            .post(this.API_URL+'/bankAccount', requestBankAccountDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateBankAccount (bankAccountId : number, requestBankAccountDto: RequestBankAccountDto): Observable<ResponseApi> {
    return this.httpClient
            .put(this.API_URL +'/bankAccount/'+ bankAccountId, requestBankAccountDto,  HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteBankAccount (bankAccountId: number): Observable<ResponseApi> {
    return this.httpClient
          .delete(this.API_URL + '/bankAccount/'+ bankAccountId, HttpOptionsConst)
          .map(
              res => res
            )
          .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  get data(): BankAccount[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getTotalSize() : number{
    return this.totalSize.value;
}
}
