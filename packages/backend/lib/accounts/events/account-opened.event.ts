import { ACCOUNT_OPENED_EVENT_TYPE } from '../../events';
import { Event } from '../../framework/event';

export interface AccountOpenedEventData {
  accountId: string;
}

export class AccountOpenedEvent extends Event<
  'accountId',
  AccountOpenedEventData
> {
  eventName = ACCOUNT_OPENED_EVENT_TYPE;
  identityBy = 'accountId' as const;
}
