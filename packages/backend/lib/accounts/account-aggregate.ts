import {
  CREDIT_ACCOUNT_COMMAND_TYPE,
  DEBIT_ACCOUNT_COMMAND_TYPE,
  OPEN_ACCOUNT_COMMAND_TYPE,
} from '../commands';
import {
  ACCOUNT_CREDITED_EVENT_TYPE,
  ACCOUNT_DEBITED_EVENT_TYPE,
  ACCOUNT_OPENED_EVENT_TYPE,
} from '../events';
import { Aggregate } from '../framework/aggregate-root';
import { CreditAccountCommand } from './commands/credit-account.command';
import { DebitAccountCommand } from './commands/debit-account.command';
import { OpenAccountCommand } from './commands/open-account.command';
import { AccountCreditedEvent } from './events/account-credited.event';
import { AccountDebitedEvent } from './events/account-debited.event';
import { AccountOpenedEvent } from './events/account-opened.event';

export interface AccountAggregateState {
  accountId: string | null;
  balance: number;
}

// OPEN ACCOUNT
const executeOpenAccountCommand = (
  state: AccountAggregateState,
  cmd: OpenAccountCommand
) => {
  if (state.accountId) return { ok: false, error: 'Account already exists' };

  return { ok: true, events: [new AccountOpenedEvent(cmd.data)] };
};

const applyAccountOpenedEvent = (
  state: AccountAggregateState,
  cmd: OpenAccountCommand
) => {
  return {
    accountId: cmd.data.accountId,
    balance: 0,
  };
};

// CREDIT ACCOUNT

const executeCreditAccountCommand = (
  state: AccountAggregateState,
  cmd: CreditAccountCommand
) => {
  if (!state.accountId) return { ok: false, error: 'not found' };

  return { ok: true, events: [new AccountCreditedEvent(cmd.data)] };
};

const applyAccountCreditedEvent = (
  state: AccountAggregateState,
  event: AccountCreditedEvent
) => ({
  ...state,
  balance: state.balance + event.data.amount,
});

// DEBIT ACCOUNT

const executeDebitAccountCommand = (
  state: AccountAggregateState,
  cmd: DebitAccountCommand
) => {
  if (!state.accountId) return { ok: false, error: 'not found' };
  if (state.balance < cmd.data.amount)
    return { ok: false, error: 'not enough money' };

  return { ok: true, events: [new AccountDebitedEvent(cmd.data)] };
};

const applyAccountDebitedEvent = (
  state: AccountAggregateState,
  event: AccountDebitedEvent
) => ({
  ...state,
  balance: state.balance - event.data.amount,
});

export const accountAggregate: Aggregate<'accountId', AccountAggregateState> = {
  identityBy: 'accountId',
  initState: () => ({ accountId: null, balance: 0 }),
  executeMap: {
    [OPEN_ACCOUNT_COMMAND_TYPE]: executeOpenAccountCommand,
    [CREDIT_ACCOUNT_COMMAND_TYPE]: executeCreditAccountCommand,
    [DEBIT_ACCOUNT_COMMAND_TYPE]: executeDebitAccountCommand,
  },

  applyMap: {
    [ACCOUNT_OPENED_EVENT_TYPE]: applyAccountOpenedEvent,
    [ACCOUNT_CREDITED_EVENT_TYPE]: applyAccountCreditedEvent,
    [ACCOUNT_DEBITED_EVENT_TYPE]: applyAccountDebitedEvent,
  },
};
