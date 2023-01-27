import { Event } from '../event';

export interface TestEventData {
  myId: string;
}

export const TEST_EVENT = 'TEST_EVENT';

export class TestEvent extends Event<'myId', TestEventData> {
  eventName = TEST_EVENT;
  identityBy = 'myId' as const;
}
