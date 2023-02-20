import { ACCOUNT_OPENED_EVENT_TYPE } from '../../events';
import { Event } from '../../framework/event';

interface AccountOpenedEventData {
  accountId: string;
  issuer: {
    userId: string;
    userEmail: string;
    tenantId: string;
  };
}

export class AccountOpenedEvent extends Event<
  'accountId',
  AccountOpenedEventData
> {
  eventName = ACCOUNT_OPENED_EVENT_TYPE;
  identityBy = 'accountId' as const;
}
