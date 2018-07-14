import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Globals } from '../shared/models/globals';
import { Router } from '@angular/router';
import { MessageAlertHandleService } from '../services/message-alert.service';
import { Customer } from '../models/customer';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private message : string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private globals: Globals,
    private router: Router,
    public _messageAlertHandleService: MessageAlertHandleService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.maxLength(18)] ),
      password: new FormControl('', [Validators.required, Validators.maxLength(64)] )
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        successData => {
          this.globals.customer = successData.response.content;
          this.putSession(successData.response.content);
          this.message = successData.response.message;
        },
        error => {
          this._messageAlertHandleService.handleError(error);
        },
        () => {
          if(this.globals.customer.id_rol != null){
              localStorage.setItem("token", this.message);
              this._messageAlertHandleService.handleSuccess('Login successful');
              this.authService.getLoggedIn().next(true);
              this.router.navigate(['/dashboard']);                    
          }else{
            this._messageAlertHandleService.handleError('You dont have any rol for access to this web. Contact the administrator to obtain permission');
          }                
        }
  );
    }
    this.formSubmitAttempt = true;
  }

  putSession(customer : Customer){
    sessionStorage.setItem("id", ''+ customer.id);
    sessionStorage.setItem("username", customer.user);
    sessionStorage.setItem("firstName", customer.firstName);
    sessionStorage.setItem("lastName", customer.lastName);
    sessionStorage.setItem("id_rol", ''+ customer.id_rol);
  }
}
