import { BankAccount } from "./bank-account";

export class Customer {
    id: number;
    firstName: string;
    lastName: string;
    birthDate : string;
    documentNumber : string;
    isActive : string;
    cellphone: string;
    email : string;
    user : string;
    password : string;
    id_rol : number;
    bankAccounts : BankAccount[];

    constructor() {}

    public setId(value: number): Customer {
        this.id = value;
        return this;
    }

    public setFirstName(value: string): Customer {
        this.firstName = value;
        return this;
    }
    public setLastName(value: string): Customer {
        this.lastName = value;
        return this;
    }
    public setBirthDate(value: string): Customer {
        this.birthDate = value;
        return this;
    }
    public setDocumentNumber(value: string): Customer {
        this.documentNumber = value;
        return this;
    }
    public setIsActive(value: string): Customer {
        this.isActive = value;
        return this;
    }
    public setCellphone(value: string): Customer {
        this.cellphone = value;
        return this;
    }
    public setEmail(value: string): Customer {
        this.email = value;
        return this;
    }
    public setUser(value: string): Customer {
        this.user = value;
        return this;
    }
    public setPassword(value: string): Customer {
        this.password = value;
        return this;
    }
    public setRolId(value: number): Customer {
        this.id_rol = value;
        return this;
    }
}
