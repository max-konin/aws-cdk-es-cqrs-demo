import { aws_dynamodb } from 'aws-cdk-lib';
import { StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export const initDynamoDb = (scope: Construct) => {
  const eventStore = new aws_dynamodb.Table(scope, 'EventStore', {
    partitionKey: {
      name: 'id',
      type: aws_dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: 'timestamp',
      type: aws_dynamodb.AttributeType.NUMBER,
    },
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
  });

  const accountsTable = new aws_dynamodb.Table(scope, 'ReadStoreAccounts', {
    partitionKey: {
      name: 'id',
      type: aws_dynamodb.AttributeType.STRING,
    },
  });

  return { eventStore, accountsTable };
};
