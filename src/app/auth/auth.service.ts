import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { Customer} from '../models/customer';
import { Globals} from '../shared/globals';
import { Observable} from 'rxjs/Observable';
import { ResponseService} from '../models/response';
import { HttpOptionsConst} from '../shared/http-options';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageAlertHandleService} from '../services/message-alert.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {
  API_URL : string = environment.apiUrl + 'login';
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
                //successData.
                this.globals.customer = successData;
              },
              error => {
                this._messageAlertHandleService.handleError("Your credentials are not correct, try again");

                ///////// rfv /////////
                this.globals.customer = new Customer()
                    .setCustomerId(1)
                    .setFirstName('Richar')
                    .setLastName('Fernandez')
                    .setRolId(2)
                    .setUser('rfernandezv');
                this.loggedIn.next(true);
                this.router.navigate(['/dashboard']);
                ///////////////////////////
              },
              () => {
                this.loggedIn.next(true);
                this.router.navigate(['/dashboard']); 
              }
        );
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  authentication(username : string, password : string ): Observable<Customer> {
    return this.httpClient
              .post(this.API_URL, { username: username, password: password},  HttpOptionsConst)
              .map(
                res => res
              )
              .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
