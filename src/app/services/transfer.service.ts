import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Transfer} from '../models/transfer';
import {ResponseService} from '../models/response';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Response, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json', // application/json; charset=UTF-8
      'Access-Control-Allow-Origin': '*'
      //'Authorization': 'my-auth-token'
    })
  };
  
@Injectable()
export class TranferDataService {
  servicio : string = 'transfers';  
  responseAPI : ResponseService;
  API_URL : string = environment.apiUrlTransfer + this.servicio;
  constructor (private httpClient: HttpClient) {}

  newTransferAccount(transfer : Transfer): Observable<ResponseService> {

    return this.httpClient
               .post(this.API_URL, transfer,  httpOptions)
               .map(
                res => res
               )
               .catch((error: any) => Observable.throw(error || 'Server error'));
  }


}

