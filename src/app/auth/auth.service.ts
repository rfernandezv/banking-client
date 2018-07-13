import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { Customer} from '../models/customer';
import { Globals} from '../shared/models/globals';
import { Observable} from 'rxjs/Observable';
import { HttpOptionsConst} from '../shared/models/http-options';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageAlertHandleService} from '../services/message-alert.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ResponseApi } from '../models/dto/responseApi';


@Injectable()
export class AuthService {
  API_URL : string = environment.apiUrl + 'login';
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private message : string;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private globals: Globals,
    public _messageAlertHandleService: MessageAlertHandleService,
  ) {}

  login(user: User) {
    if (user.userName !== '' && user.password !== '' ) {      

       this.authentication(user.userName, user.password).subscribe(
              successData => {
                this.globals.customer = successData.response.content;                
                this.message = successData.response.message;
              },
              error => {
                this._messageAlertHandleService.handleError(error);
              },
              () => {
                if(this.globals.customer.id_rol != null){
                    localStorage.setItem("token", this.message);
                    this._messageAlertHandleService.handleSuccess('Login successful');
                    this.loggedIn.next(true);
                    this.router.navigate(['/dashboard']);                    
                }else{
                  this._messageAlertHandleService.handleError('You dont have any rol for access to this web. Contact the administrator to obtain permission');
                }                
              }
        );
    }
  }

  logout() {
    localStorage.removeItem("token")
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  authentication(username : string, password : string ): Observable<ResponseApi> {
    return this.httpClient
              .post(this.API_URL, {user: username, password: password},  HttpOptionsConst)
              .map(
                res => res
              )
              .catch((error: any) => Observable.throw(error));
  }
}
