import { ACCOUNT_CREDITED_EVENT_TYPE } from '../../events';
import { Event } from '../../framework/event';

export interface AccountCreditedEventData {
  accountId: string;
  amount: number;
}

export class AccountCreditedEvent extends Event<
  'accountId',
  AccountCreditedEventData
> {
  eventName = ACCOUNT_CREDITED_EVENT_TYPE;
  identityBy = 'accountId' as const;
}
