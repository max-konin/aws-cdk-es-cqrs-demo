import { AccountCreditedEvent } from './accounts/events/account-credited.event';
import { AccountDebitedEvent } from './accounts/events/account-debited.event';
import { AccountOpenedEvent } from './accounts/events/account-opened.event';
import {
  ACCOUNT_CREDITED_EVENT_TYPE,
  ACCOUNT_DEBITED_EVENT_TYPE,
  ACCOUNT_OPENED_EVENT_TYPE,
} from './events';

export const eventsRegistry = {
  [ACCOUNT_OPENED_EVENT_TYPE]: AccountOpenedEvent,
  [ACCOUNT_CREDITED_EVENT_TYPE]: AccountCreditedEvent,
  [ACCOUNT_DEBITED_EVENT_TYPE]: AccountDebitedEvent,
};
