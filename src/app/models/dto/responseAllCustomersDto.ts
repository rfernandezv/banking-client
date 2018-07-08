import { Customer } from "../customer";

export class ResponseAllCustomersDto {
    currentPage: number;
    pageSize: number;
    totalRecords: number;    
    totalPages: number;
    content: Customer[];

    constructor() {}
}
