import {Injectable} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {Response} from '@angular/http';
import {HttpErrorResponse } from '@angular/common/http';
import {ResponseApi } from '../models/dto/responseApi';
import {Response as ResponseError } from '../models/response';

@Injectable()
export class MessageAlertHandleService {
    constructor(private toastr: ToastsManager) {}

    handleError(err: any) {

        let errorMessage = 'Process not completed, please try later';
        if (typeof err === 'string') {
            errorMessage = err ;
            this.toastr.error(errorMessage);
            return;
        }
        if(err instanceof HttpErrorResponse){
            const res: HttpErrorResponse = err;

            if(res.status == 400){
                const errorArray2: ResponseError = res.error.response;
                errorArray2.errors.forEach(
                    error => {
                        this.toastr.error(error.message);
                    }
                );
            }
            if(res.status == 401){
                errorMessage = 'You are '+ err.statusText + ". Your credentials are not correct, try again";
                this.toastr.error(errorMessage);
            }
            if(res.status == 500){
                this.toastr.error(err.statusText);
                return;
            }            
        }
        if(err instanceof ResponseApi){
            const res: ResponseApi = err;
            if(res.response.errors != null && res.response.errors.length > 0){
                errorMessage = res.response.errors.join('\n');
            }
            this.toastr.error(errorMessage);
            return;
        } 
        if (err instanceof Response) {
            const res: Response = err;

            if (res.text() && res.text() !== res.statusText) {

                const errorArray: any[] = JSON.parse(res.text());

                if (errorArray != undefined && errorArray['errors'] != undefined && errorArray['errors'].length > 0) {

                    errorMessage = errorArray['errors'].join('\n');
                }

                if (errorArray != undefined && errorArray['message'] != undefined && errorArray['message'].length > 0) {

                    errorMessage = errorArray['message'];
                }
            }
            this.toastr.error(errorMessage);
            return;
        }
       
    }

    handleSuccess(message: string) {

        this.toastr.success(message);

    }
}
