import { Event } from './event';
import { EventStore } from './event-store';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { eventsRegistry } from '../events-registry';

export type EventMap = Record<string, new (data: unknown) => Event>;

export class DynamoDBEventStore implements EventStore {
  constructor(
    private readonly eventsTableName: string,
    private readonly client: DocumentClient
  ) {}

  emitEvent(event: any, correlationId: string) {
    const createdAt = new Date();
    return this.client
      .put({
        TableName: this.eventsTableName,
        Item: {
          id: event.id,
          timestamp: createdAt.valueOf(),
          data: event.data,
          entityId: event.entityId,
          eventName: event.eventName,
          correlationId,
          createdAt: new Date().toISOString(),
        },
      })
      .promise();
  }

  async getEvents(entityId: string) {
    const res = await this.client
      .scan({
        TableName: this.eventsTableName,
        FilterExpression: 'entityId = :entityId',
        ExpressionAttributeValues: {
          ':entityId': entityId,
        },
      })
      .promise();
    const items = res.Items ?? [];
    // TODO: DynamoDB sorting;
    return items
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((record) => {
        const eventClass = eventsRegistry[record.eventName as string];
        if (!eventClass) return undefined;
        return new eventClass(record.data, record.id as string);
      })
      .filter((e) => e) as Event<'accountId', Record<'accountId', string>>[];
  }
}
