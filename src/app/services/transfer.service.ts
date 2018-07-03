import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Transfer} from '../models/transfer';
import {ResponseService} from '../models/response';
import {HttpOptionsConst} from '../shared/http-options';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Response, RequestOptions, Headers } from '@angular/http';
import {environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class TranferService {
  API_URL : string = environment.apiUrl + 'transfers';
  constructor (private httpClient: HttpClient) {}

  newTransferAccount(transfer : Transfer): Observable<ResponseService> {
      return this.httpClient
                .post(this.API_URL, transfer,  HttpOptionsConst)
                .map(
                  res => res
                )
                .catch((error: any) => Observable.throw(error || 'Server error'));
  }


}

