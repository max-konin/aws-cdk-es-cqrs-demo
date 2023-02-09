// this is an auto generated file. This will be overwritten

export type AccountData = {
  id: string;
  balance: number;
};

export const openAccount = /* GraphQL */ `
  mutation OpenAccount($input: OpenAccountInput) {
    openAccount(input: $input) {
      id
      balance
    }
  }
`;

export type OpenAccountVariables = {
  input: {
    accountId: string;
  };
};

export type OpenAccountData = {
  openAccount: AccountData
};

export const debitAccount = /* GraphQL */ `
  mutation DebitAccount($input: DebitAccountInput) {
    debitAccount(input: $input) {
      id
      balance
    }
  }
`;

export const creditAccount = /* GraphQL */ `
  mutation CreditAccount($input: CreditAccountInput) {
    creditAccount(input: $input) {
      id
      balance
    }
  }
`;

export type UpdateAccountVariables = {
  input: { accountId: string; amount: number };
};

export type CreaditAccountData = {
  creaditAccount: AccountData
}

export type DebitAccountData = {
  debitAccount: AccountData
}