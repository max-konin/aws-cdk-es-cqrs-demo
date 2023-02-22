import { AccountCreditedEvent, AccountCreditedEventData } from './accounts/events/account-credited.event';
import { AccountDebitedEvent, AccountDebitedEventData } from './accounts/events/account-debited.event';
import { AccountOpenedEvent, AccountOpenedEventData } from './accounts/events/account-opened.event';
import {
  ACCOUNT_CREDITED_EVENT_TYPE,
  ACCOUNT_DEBITED_EVENT_TYPE,
  ACCOUNT_OPENED_EVENT_TYPE,
} from './events';
import { IEvent } from './framework/event';

export type AccountEventData = AccountOpenedEventData & AccountCreditedEventData & AccountDebitedEventData;

interface IEventsRegistry {
  [key: string]: new (data: AccountEventData, id?: string) => IEvent;
}

export const eventsRegistry: IEventsRegistry = {
  [ACCOUNT_OPENED_EVENT_TYPE]: AccountOpenedEvent,
  [ACCOUNT_CREDITED_EVENT_TYPE]: AccountCreditedEvent,
  [ACCOUNT_DEBITED_EVENT_TYPE]: AccountDebitedEvent,
};
