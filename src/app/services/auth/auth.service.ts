import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../models/user';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { environment } from '../../../environments/environment';
import { Globals } from '../../shared/models/globals';
import { Customer } from '../../models/customer';
import { HttpOptionsConst } from '../../shared/models/http-options';
import { ResponseApi } from '../../models/dto/responseApi';


@Injectable()
export class AuthService {
  API_URL : string = environment.apiUrl + 'login';
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private message : string;


  getLoggedIn() : BehaviorSubject<boolean>{
    return this.loggedIn;
  }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  get isLoggedInValue(): boolean {
    return this.loggedIn.value;
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private globals: Globals
  ) {}

  login(user: User) {
    if (user.userName !== '' && user.password !== '' ) {      

       return this.authentication(user.userName, user.password);
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

  putSession(customer : Customer){
    sessionStorage.setItem("id", ''+ customer.id);
    sessionStorage.setItem("username", customer.user);
    sessionStorage.setItem("firstName", customer.firstName);
    sessionStorage.setItem("lastName", customer.lastName);
    sessionStorage.setItem("id_rol", ''+ customer.id_rol);
  }
}
