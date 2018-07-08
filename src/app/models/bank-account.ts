export class BankAccount {
     id: number;
     number: string;
     balance: number;
     isLocked: string;
     customerId: number;

     constructor() {}

    public setId(value: number): BankAccount {
        this.id = value;
        return this;
    }

    public setNumber(value: string): BankAccount {
        this.number = value;
        return this;
    }

    public setBalance(value: number): BankAccount {
        this.balance = value;
        return this;
    }

    public setIsLocked(value: string): BankAccount {
        this.isLocked = value;
        return this;
    }

    public setCustomerId(value: number): BankAccount {
        this.customerId = value;
        return this;
    }
}
