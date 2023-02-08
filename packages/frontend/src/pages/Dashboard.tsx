/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
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
import { creditAccount, debitAccount } from '../graphql/mutations';
import { useAccountStore } from '../store/accounts';

function Dashboard() {
  const subscribeOnAccountOpened = useAccountStore(
    (state) => state.subscribeOnAccountOpened
  );
  const findAccounts = useAccountStore((state) => state.findAccounds);
  const addAccount = useAccountStore((state) => state.addAccount);
  const accounts = useAccountStore((state) => state.accounts);

  const [accountToChangeId, setAccountToChangeId] = useState<string>();
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    void findAccounts();
    subscribeOnAccountOpened();
    setAccountToChangeId(accounts[0]?.id || '');
  }, []);

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

  return (
    <div>
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

      <Button onClick={() => void addAccount()}>Open New Account</Button>

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

      <Button onClick={() => void debitAccountAction()}>Debit</Button>
      <Button onClick={() => void creditAccountAction()}>Credit</Button>
    </div>
  );
}

export default Dashboard;
