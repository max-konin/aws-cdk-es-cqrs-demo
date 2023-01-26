import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { aws_dynamodb } from 'aws-cdk-lib';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { StreamViewType } from 'aws-cdk-lib/aws-dynamodb';

export class AccountsConstruct extends Construct {
  public mutationsResolver: NodejsFunction;
  public queriesResolver: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const eventsTable = new aws_dynamodb.Table(this, 'EventStore', {
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

    const accountsTable = new aws_dynamodb.Table(this, 'ReadStoreAccounts', {
      partitionKey: {
        name: 'id',
        type: aws_dynamodb.AttributeType.STRING,
      },
    });

    this.mutationsResolver = new NodejsFunction(this, 'mutations', {
      environment: {
        EVENTS_TABLE_NAME: eventsTable.tableName,
      }
    });

    this.queriesResolver = new NodejsFunction(this, 'Queries', {
      environment: {
        ACCOUNTS_TABLE_NAME: accountsTable.tableName,
      }
    })

    const accountProjector = new NodejsFunction(this, 'projector', {
      environment: {
        ACCOUNTS_TABLE_NAME: accountsTable.tableName,
        EVENTS_TABLE_NAME: eventsTable.tableName,
      }
    });

    accountsTable.grantFullAccess(accountProjector);
    accountsTable.grantFullAccess(this.queriesResolver);

    eventsTable.grantFullAccess(this.mutationsResolver);

    const sourceMapping = new DynamoEventSource(eventsTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      bisectBatchOnError: true,
      retryAttempts: 10,
    });

    sourceMapping.bind(accountProjector);
  }
}
