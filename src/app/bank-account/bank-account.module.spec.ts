import { BankAccountModule } from './bank-account.module';

describe('BankAccountModule', () => {
  let bankAccountModule: BankAccountModule;

  beforeEach(() => {
    bankAccountModule = new BankAccountModule();
  });

  it('should create an instance', () => {
    expect(bankAccountModule).toBeTruthy();
  });
});
