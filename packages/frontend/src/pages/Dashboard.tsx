import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import {
  Button,
  SelectField,
  SliderField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@aws-amplify/ui-react';
import {
  OpenAccountData,
  OpenAccountVariables,
  creditAccount,
  debitAccount,
  DebitAccountData,
  openAccount,
  UpdateAccountVariables,
} from '../graphql/mutations';
import { getAllAccounts, GetAllAccountsData } from '../graphql/queries';
import { Account, CreditAccountMutation } from '../API';
import {
  useGraphQLMutaion,
  useGraphQLQuery,
  useGraphQLSubscription,
} from '../lib/graphQL';
import { v4 } from 'uuid';
import { useQueryClient } from 'react-query';
import {
  openedAccount,
  updatedAccount,
  UpdatedAccountVariables,
} from '../graphql/subscriptions';

type Subscription = ZenObservable.Subscription;

function Dashboard() {
  const queryClient = useQueryClient();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useGraphQLSubscription(openedAccount, {
    next: () => queryClient.invalidateQueries(['getAllAccounts']),
  });

  const { data } = useGraphQLQuery<GetAllAccountsData>(
    ['getAllAccounts'],
    getAllAccounts,
    undefined,
    {
      onSuccess: ({ getAllAccounts }) => {
        subscriptions.forEach((s) => s.unsubscribe());
        setSubscriptions(
          getAllAccounts
            .map((a) =>
              useGraphQLSubscription<{}, UpdatedAccountVariables>(
                updatedAccount,
                {
                  next: () => queryClient.invalidateQueries(['getAllAccounts']),
                },
                { id: a.id }
              )
            )
            .filter((s): s is Subscription => !!s)
        );
      },
    }
  );

  const { mutateAsync } = useGraphQLMutaion<
    OpenAccountData,
    OpenAccountVariables
  >(openAccount);

  return (
    <div>
      <AccountsTable accounts={data?.getAllAccounts ?? []} />
      <hr />

      <Button
        onClick={() =>
          void mutateAsync({
            input: {
              accountId: v4(),
            },
          })
        }
      >
        Open New Account
      </Button>

      <hr />

      <AccountPanel accounts={data?.getAllAccounts ?? []} />
    </div>
  );
}

function AccountsTable(props: { accounts: Account[] }) {
  return (
    <Table caption="" highlightOnHover={false}>
      <TableHead>
        <TableRow>
          <TableCell as="th">ID</TableCell>
          <TableCell as="th">Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.accounts.map(({ id, balance }) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>{balance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AccountPanel(props: { accounts: Account[] }) {
  const [currentId, setCurrentId] = useState<string>(props.accounts[0]?.id);
  const [amount, setAmount] = useState(100);

  const { mutateAsync: creditMutation } = useGraphQLMutaion<
    CreditAccountMutation,
    UpdateAccountVariables
  >(creditAccount);

  const { mutateAsync: debitMutation } = useGraphQLMutaion<
    DebitAccountData,
    UpdateAccountVariables
  >(debitAccount);

  const creditAccountAction = async () => {
    if (!currentId || !amount) return;

    await creditMutation({ input: { accountId: currentId, amount } });
  };

  const debitAccountAction = async () => {
    if (!currentId || !amount) return;

    await debitMutation({ input: { accountId: currentId, amount } });
  };

  return (
    <div>
      <SelectField
        label="AccountId"
        value={currentId}
        onChange={(e) => setCurrentId(e.target.value)}
      >
        {props.accounts.map((a) => (
          <option key={a.id}>{a.id}</option>
        ))}
      </SelectField>

      <SliderField
        label="Amount"
        value={amount}
        onChange={setAmount}
        max={1000}
      />

      <Button onClick={() => void debitAccountAction()}>Debit</Button>
      <Button onClick={() => void creditAccountAction()}>Credit</Button>
    </div>
  );
}

export default Dashboard;
