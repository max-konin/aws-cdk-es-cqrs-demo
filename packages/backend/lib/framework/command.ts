import { ZodObject, ZodTypeAny } from 'zod';

type StringKeys<T> = {
  [P in keyof T]: T[P] extends string ? P : never;
}[keyof T];

type CommandDataBase = Record<string, ZodTypeAny>;

export interface ICommand<T extends CommandDataBase> {
  schema: ZodObject<T>;
  data: T;
  identityBy: StringKeys<T>;
}

export const getEntityId = <T extends CommandDataBase>(command: ICommand<T>) =>
  command.data[command.identityBy];

export const isValid = <T extends CommandDataBase>(command: ICommand<T>) => {
  if (!command.schema) return true;

  return command.schema.safeParse(command.data).success;
};

export const getData = <T extends CommandDataBase>(command: ICommand<T>) => {
  if (!command.schema) return command.data;

  return command.schema.parse(command.data) as T;
};

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
