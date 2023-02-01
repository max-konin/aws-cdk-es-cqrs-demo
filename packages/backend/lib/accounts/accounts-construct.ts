import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { aws_dynamodb } from 'aws-cdk-lib';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';

export class AccountsConstruct extends Construct {
  public mutationsResolver: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    private readonly eventStore: aws_dynamodb.Table,
    private readonly accountsTable: aws_dynamodb.Table
  ) {
    super(scope, id);

    this.mutationsResolver = new NodejsFunction(this, 'mutations', {
      environment: {
        EVENTS_TABLE_NAME: this.eventStore.tableName,
      },
    });

    const accountProjector = new NodejsFunction(this, 'projector', {
      environment: {
        ACCOUNTS_TABLE_NAME: this.accountsTable.tableName,
        EVENTS_TABLE_NAME: this.eventStore.tableName,
      },
    });

    this.accountsTable.grantFullAccess(accountProjector);

    this.eventStore.grantFullAccess(this.mutationsResolver);
    this.eventStore.grantFullAccess(accountProjector); // TODO: DO NOT READ FROM EVENT STORE

    const sourceMapping = new DynamoEventSource(this.eventStore, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      bisectBatchOnError: true,
      retryAttempts: 10,
    });

    sourceMapping.bind(accountProjector);
  }
}
