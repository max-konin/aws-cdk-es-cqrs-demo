import { ZodObject, ZodRawShape } from 'zod';

export abstract class Command<
  I extends string = 'id',
  T extends Record<I, string> = Record<I, string>
> {
  schema?: ZodObject<{}>;
  abstract commandName: string;
  abstract identityBy: I;

  constructor(private readonly _data: T) {}

  get entityId() {
    return this._data[this.identityBy];
  }

  get isValid() {
    if (!this.schema) return true;

    return this.schema.safeParse(this._data).success;
  }

  get data(): T {
    if (!this.schema) return this._data;

    return this.schema.parse(this._data) as T;
  }
}
