import { BankAccount } from "../bank-account";

export class ResponseAllBankAccountDto {
    currentPage: number;
    pageSize: number;
    totalRecords: number;    
    totalPages: number;
    content: BankAccount[];

    constructor() {}
}
