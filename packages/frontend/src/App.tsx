/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  SelectField,
  SliderField,
} from '@aws-amplify/ui-react';
import { getAllAccounts } from './graphql/queries';
import { openAccount, creditAccount, debitAccount } from './graphql/mutations';
import { v4 } from 'uuid';
import { GetAllAccountsQuery, Account, OpenedAccountSubscription } from './API';
import { openedAccount } from './graphql/subscriptions';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Files from './components/files';

const queryClient = new QueryClient();

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountToChangeId, setAccountToChangeId] = useState<string>();
  const [amount, setAmount] = useState(100);

  const subscribeOnAccountOpened = () => {
    API.graphql(graphqlOperation(openedAccount)).subscribe({
      next: ({
        value,
      }: Record<'value', Record<'data', OpenedAccountSubscription>>) => {
        const { openedAccount } = value.data;
        if (!openedAccount) return;
        setAccounts([...accounts, openedAccount]);
      },
    });
  };

  const fetchAccounts = async () => {
    const res = (await API.graphql(
      graphqlOperation(getAllAccounts)
    )) as GraphQLResult<GetAllAccountsQuery>;

    setAccounts(res.data?.getAllAccounts || []);
  };

  useEffect(() => {
    void fetchAccounts();
    subscribeOnAccountOpened();
  }, []);

  const openNewAccount = async () => {
    await API.graphql({
      query: openAccount,
      variables: {
        input: {
          accountId: v4(),
        },
      },
    });
  };

  const creditAccountAction = async () => {
    if (!accountToChangeId || !amount) return;

    await API.graphql({
      query: creditAccount,
      variables: { input: { accountId: accountToChangeId, amount } },
    });
  };

  const debitAccountAction = async () => {
    if (!accountToChangeId || !amount) return;

    await API.graphql({
      query: debitAccount,
      variables: { input: { accountId: accountToChangeId, amount } },
    });
  };

  const accountsList = accounts.map(({ id, balance }) => (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{balance}</TableCell>
    </TableRow>
  ));

  const accountIdOptions = accounts.map(({ id }) => (
    <option key={id} value={id}>
      {id}
    </option>
  ));

  const services = {
    handleSignUp(formData: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return Auth.signUp({
        ...formData,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        attributes: {
          ...formData.attributes,
          'custom:tenantId': 'MYTENANT', // TODO get tenant id/name
        },
      });
    },
  };

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Authenticator services={services}>
          {({ signOut, user }) => (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
              <hr />
              <Table caption="" highlightOnHover={false}>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">ID</TableCell>
                    <TableCell as="th">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{accountsList}</TableBody>
              </Table>
              <hr />
              <Button onClick={openNewAccount}>Open New Account</Button>
              <hr />
              <SelectField
                label="AccountId"
                value={accountToChangeId}
                onChange={(e) => setAccountToChangeId(e.target.value)}
              >
                {accountIdOptions}
              </SelectField>
              <SliderField
                label="Amount"
                value={amount}
                onChange={setAmount}
                max={1000}
              />
              <Button onClick={() => debitAccountAction()}>Debit</Button>
              <Button onClick={() => creditAccountAction()}>Credit</Button>
              <hr />
              <Files />
            </main>
          )}
        </Authenticator>
      </QueryClientProvider>
    </div>
  );
}

export default App;
