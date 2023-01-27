import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import {
  ACCOUNT_CREDITED_EVENT_TYPE,
  ACCOUNT_DEBITED_EVENT_TYPE,
  ACCOUNT_OPENED_EVENT_TYPE,
} from '../../events';
import { AccountCreditedEvent } from '../events/account-credited.event';
import { AccountDebitedEvent } from '../events/account-debited.event';
import { AccountOpenedEvent } from '../events/account-opened.event';

interface ReadStoreConfig {
  tableName: string;
  ddbClient: DocumentClient;
}

const projectAccountOpenedEvent = async (
  event: AccountOpenedEvent,
  readStoreConfig: ReadStoreConfig
) => {
  await readStoreConfig.ddbClient
    .put({
      TableName: readStoreConfig.tableName,
      Item: {
        id: event.entityId,
        balance: 0,
      },
    })
    .promise();
};

const projectAccountCreditedEvent = async (
  event: AccountCreditedEvent,
  readStoreConfig: ReadStoreConfig
) => {
  await readStoreConfig.ddbClient
    .update({
      TableName: readStoreConfig.tableName,
      Key: { id: event.entityId },
      ExpressionAttributeValues: { ':amount': event.data.amount },
      UpdateExpression: 'ADD balance :amount',
    })
    .promise();
};

const projectAccountDebitedEvent = async (
  event: AccountDebitedEvent,
  readStoreConfig: ReadStoreConfig
) => {
  await readStoreConfig.ddbClient
    .update({
      TableName: readStoreConfig.tableName,
      Key: { id: event.entityId },
      ExpressionAttributeValues: { ':amount': -event.data.amount },
      UpdateExpression: 'ADD balance :amount',
    })
    .promise();
};

export const projector = (readStoreConfig: ReadStoreConfig) => (event: any) => {
  switch (event.eventName) {
    case ACCOUNT_OPENED_EVENT_TYPE:
      return projectAccountOpenedEvent(event, readStoreConfig);
    case ACCOUNT_CREDITED_EVENT_TYPE:
      return projectAccountCreditedEvent(event, readStoreConfig);
    case ACCOUNT_DEBITED_EVENT_TYPE:
      return projectAccountDebitedEvent(event, readStoreConfig);
    default:
      return Promise.resolve();
  }
};
