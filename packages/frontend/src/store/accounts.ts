import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql';
import { API, graphqlOperation } from 'aws-amplify';
import { create } from 'zustand';
import {
  Account,
  GetAllAccountsQuery,
  OpenedAccountSubscription,
} from '../API';
import { openAccount } from '../graphql/mutations';
import { getAllAccounts } from '../graphql/queries';
import { openedAccount } from '../graphql/subscriptions';
import { v4 } from 'uuid';
import { devtools } from 'zustand/middleware';

export interface AccountsState {
  accounts: Account[];
  isLoading: boolean;
  errors: string[];
  addAccount: () => Promise<void>;
  subscribeOnAccountOpened: () => void;
  findAccounds: () => Promise<void>;
}
export const useAccountStore = create<AccountsState>()(
  devtools((set) => ({
    accounts: [],
    isLoading: false,
    errors: [],
    addAccount: async () => {
      await API.graphql({
        query: openAccount,
        variables: {
          input: {
            accountId: v4(),
          },
        },
      });
    },
    findAccounds: async () => {
      const res = (await API.graphql(
        graphqlOperation(getAllAccounts)
      )) as GraphQLResult<GetAllAccountsQuery>;
      set(() => ({
        accounts: res.data?.getAllAccounts || [],
      }));
    },
    subscribeOnAccountOpened: () => {
      API.graphql<GraphQLOptions>(graphqlOperation(openedAccount)).subscribe({
        next: ({
          value,
        }: Record<'value', Record<'data', OpenedAccountSubscription>>) => {
          const { openedAccount } = value.data;
          if (!openedAccount) return;
          set((state) => ({ accounts: [...state.accounts, openedAccount] }));
        },
      });
    },
  }))
);