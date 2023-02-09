/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import { Account } from "../API";

export const getAllAccounts = /* GraphQL */ `
  query GetAllAccounts {
    getAllAccounts {
      id
      balance
    }
  }
`;

export type GetAllAccountsData = {
  getAllAccounts: Account[];
}
