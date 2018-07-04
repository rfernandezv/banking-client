export class RequestBankAccountDto {
     id: number;
     number: string;
     balance: number;
     isLocked: boolean;
     customerId: number;

    constructor() {}

    public setId(value: number): RequestBankAccountDto {
        this.id = value;
        return this;
    }

    public setNumber(value: string): RequestBankAccountDto {
        this.number = value;
        return this;
    }

    public setBalance(value: number): RequestBankAccountDto {
        this.balance = value;
        return this;
    }

    public setIsLocked(value: boolean): RequestBankAccountDto {
        this.isLocked = value;
        return this;
    }

    public setCustomerId(value: number): RequestBankAccountDto {
        this.customerId = value;
        return this;
    }
}
