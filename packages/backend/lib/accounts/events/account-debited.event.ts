import { ACCOUNT_DEBITED_EVENT_TYPE } from '../../events';
import { Event } from '../../framework/event';

export interface AccountDebitedEventData {
  accountId: string;
  amount: number;
}

export class AccountDebitedEvent extends Event<
  'accountId',
  AccountDebitedEventData
> {
  eventName = ACCOUNT_DEBITED_EVENT_TYPE;
  identityBy = 'accountId' as const;
}
