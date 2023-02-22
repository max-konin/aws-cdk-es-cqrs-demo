/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const openedAccount = /* GraphQL */ `
  subscription OpenedAccount {
    openedAccount {
      id
      balance
    }
  }
`;

export type OpenedAccountData = {
  openedAccount: {
    balance: number;
    id: string;
  };
};

export const updatedAccount = /* GraphQL */ `
  subscription UpdatedAccount($id: ID!) {
    updatedAccount(id: $id) {
      id
      balance
    }
  }
`;

export type UpdatedAccountVariables = {
  id: string;
};