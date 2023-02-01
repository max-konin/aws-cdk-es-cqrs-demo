import { AggregateRoot } from '../framework/aggregate-root';
import { DynamoDBEventStore } from '../framework/dynamodb-event-store';
import { accountAggregate } from './account-aggregate';
import * as AWS from 'aws-sdk';
import { CreditAccountCommand } from './commands/credit-account.command';
import { OpenAccountCommand } from './commands/open-account.command';
import { DebitAccountCommand } from './commands/debit-account.command';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    input: any;
  };
};

const buildCommand = (appSyncEvent: AppSyncEvent) => {
  switch (appSyncEvent.info.fieldName) {
    case 'creditAccount':
      return new CreditAccountCommand(appSyncEvent.arguments.input);
    case 'openAccount':
      return new OpenAccountCommand(appSyncEvent.arguments.input);
    case 'debitAccount':
      return new DebitAccountCommand(appSyncEvent.arguments.input);
    default:
      return null;
  }
};

export const handler = async (appSyncEvent: AppSyncEvent) => {
  console.log(appSyncEvent);
  const cmd = buildCommand(appSyncEvent);

  if (!cmd) throw new Error('Unknown command');
  if (!process.env.EVENTS_TABLE_NAME)
    throw new Error('process.env.EVENTS_TABLE_NAME is undefined');

  const eventStore = new DynamoDBEventStore(
    process.env.EVENTS_TABLE_NAME,
    new AWS.DynamoDB.DocumentClient()
  );
  const aggregateRoot = new AggregateRoot(accountAggregate, eventStore);

  await aggregateRoot.loadStatesFromEventStore(cmd.entityId);

  const res = await aggregateRoot.dispatchCommand(cmd);

  if (res.ok && res.aggregateState) {
    return {
      id: res.aggregateState.accountId,
      balance: res.aggregateState.balance,
    };
  } else {
    throw new Error(res.error);
  }
};
