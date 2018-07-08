import { Customer } from "./customer";

export class Response {
    httpStatus: string;
    message: string;
    content: Customer;
    errors: Error[];
}

export class Error {
    message : string;
    cause : string;
}
