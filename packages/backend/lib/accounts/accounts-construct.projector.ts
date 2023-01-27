import { projector } from './projectors/accounts';
import * as AWS from 'aws-sdk';
import { eventsRegistry } from '../events-registry';
import { Record } from 'aws-sdk/clients/dynamodbstreams';

interface AWSEvent {
  Records: Record[];
}

export const handler = async (awsEvent: AWSEvent) => {
  if (!process.env.ACCOUNTS_TABLE_NAME)
    throw new Error('Missing process.env.ACCOUNTS_TABLE_NAME');
  if (!process.env.EVENTS_TABLE_NAME)
    throw new Error('Missing process.env.EVENTS_TABLE_NAME');

  const { ACCOUNTS_TABLE_NAME, EVENTS_TABLE_NAME } = process.env;

  const ddbClient = new AWS.DynamoDB.DocumentClient();
  const accountsProjector = projector({
    tableName: ACCOUNTS_TABLE_NAME,
    ddbClient,
  });

  const items = awsEvent.Records || [];

  // @ts-ignore
  const events = await Promise.all(
    items
      .sort(
        (a, b) =>
          a.dynamodb?.NewImage?.timestamp?.N -
          b.dynamodb?.NewImage?.timestamp?.N
      )
      .map(async (record) => {
        if (record.eventName !== 'INSERT') return undefined;

        if (!record.dynamodb?.Keys) return undefined;

        // TODO: deserialize data from DDB stream
        const res = await ddbClient
          .query({
            TableName: EVENTS_TABLE_NAME,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
              ':id': record.dynamodb?.Keys?.id?.S,
            },
          })
          .promise();

        if (!res.Items) return undefined;

        const item = res.Items[0];
        // @ts-ignore
        const eventClass = eventsRegistry[item.eventName];
        if (!eventClass) return undefined;
        return new eventClass(item.data) as Event;
      })
  );

  for (const event of events.filter((e) => e)) {
    console.log('PROJECT EVENT', event);
    await accountsProjector(event);
  }
};
