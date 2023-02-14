import { ACCOUNT_DEBITED_EVENT_TYPE } from '../../events';
import { Event } from '../../framework/event';

interface AccountDebitedEventData {
  accountId: string;
  amount: number;
  issuer: {
    userId: string;
    userEmail: string;
    tenantId: string;
  };
}

export class AccountDebitedEvent extends Event<
  'accountId',
  AccountDebitedEventData
> {
  eventName = ACCOUNT_DEBITED_EVENT_TYPE;
  identityBy = 'accountId' as const;
}
