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
    input: object;
  };
  identity: {
    claims: {
      email: string;
      sub: string;
      'custom:tenantId': string;
    };
  };
};

const extractIssuer = (appSyncEvent: AppSyncEvent) => ({
  userId: appSyncEvent.identity.claims.sub,
  tenantId: appSyncEvent.identity.claims['custom:tenantId'],
  userEmail: appSyncEvent.identity.claims.email,
});

const inputWithIssuer = (appSyncEvent: AppSyncEvent) => ({
  ...appSyncEvent.arguments.input,
  issuer: extractIssuer(appSyncEvent),
});

const buildCommand = (appSyncEvent: AppSyncEvent) => {
  switch (appSyncEvent.info.fieldName) {
    case 'creditAccount':
      return new CreditAccountCommand(inputWithIssuer(appSyncEvent));
    case 'openAccount':
      return new OpenAccountCommand(inputWithIssuer(appSyncEvent));
    case 'debitAccount':
      return new DebitAccountCommand(inputWithIssuer(appSyncEvent));
    default:
      return null;
  }
};

export const handler = async (appSyncEvent: AppSyncEvent) => {
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
