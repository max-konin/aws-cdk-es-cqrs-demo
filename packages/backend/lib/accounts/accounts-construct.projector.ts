import * as AWS from 'aws-sdk';
import { Record } from 'aws-sdk/clients/dynamodbstreams';
import { AccountEventData, eventsRegistry } from '../events-registry';
import { projector } from './projectors/accounts';

interface Image<T> {
  createdAt: string;
  data: T
  eventName: string;
  correlationId: string;
  entityId: string;
  id: string;
  timestamp: number;
}


interface AWSEvent {
  Records: Record[];
}

export const handler = async (awsEvent: AWSEvent) => {
  if (!process.env.ACCOUNTS_TABLE_NAME)
    throw new Error('Missing process.env.ACCOUNTS_TABLE_NAME');
  if (!process.env.EVENTS_TABLE_NAME)
    throw new Error('Missing process.env.EVENTS_TABLE_NAME');

  const { ACCOUNTS_TABLE_NAME } = process.env;

  const ddbClient = new AWS.DynamoDB.DocumentClient();
  const accountsProjector = projector({
    tableName: ACCOUNTS_TABLE_NAME,
    ddbClient,
  });

  const items = awsEvent.Records || [];

  const events = items
    .map((record) => {
      if (record.eventName !== 'INSERT') return undefined;

      if (!record.dynamodb?.NewImage) return undefined;

      const newImage = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage
      );

      if (!Object.keys(eventsRegistry).includes(newImage.eventName))
        return undefined;

      return newImage;
    })
    .filter((r): r is Image<AccountEventData> => !!r)
    .sort((a, b) => a?.timestamp - b?.timestamp)
    .map((record) => new eventsRegistry[record?.eventName](record?.data));

  for (const event of events) {
    console.log('PROJECT EVENT', event);
    await accountsProjector(event);
  }
};
