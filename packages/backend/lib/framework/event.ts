import { v4 } from 'uuid';

export abstract class Event<I extends string = 'id', T extends Record<I, string> = Record<I, string>> {
  abstract eventName: string;
  abstract identityBy: I
  id: string;

  constructor(public readonly data: T, id?: string) {
    this.id = id ?? v4();
  }

  get entityId() {
    return this.data[this.identityBy];
  };
}