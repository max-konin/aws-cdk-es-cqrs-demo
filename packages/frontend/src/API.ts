/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type OpenAccountInput = {
  accountId: string,
};

export type Account = {
  __typename: "Account",
  id: string,
  balance: number,
};

export type DebitAccountInput = {
  accountId: string,
  amount: number,
};

export type CreditAccountInput = {
  accountId: string,
  amount: number,
};

export type OpenAccountMutationVariables = {
  input?: OpenAccountInput | null,
};

export type OpenAccountMutation = {
  openAccount?:  {
    __typename: "Account",
    id: string,
    balance: number,
  } | null,
};

export type DebitAccountMutationVariables = {
  input?: DebitAccountInput | null,
};

export type DebitAccountMutation = {
  debitAccount?:  {
    __typename: "Account",
    id: string,
    balance: number,
  } | null,
};

export type CreditAccountMutationVariables = {
  input?: CreditAccountInput | null,
};

export type CreditAccountMutation = {
  creditAccount?:  {
    __typename: "Account",
    id: string,
    balance: number,
  } | null,
};

export type GetAllAccountsQuery = {
  getAllAccounts:  Array< {
    __typename: "Account",
    id: string,
    balance: number,
  } >,
};
