import { Event } from './event';

export interface EventStore {
  emitEvent: <I extends string, E extends Event<I>>(event: E, correlationId: string) => Promise<unknown>;
  getEvents: (entityId: string) => Promise<unknown[]>;
}