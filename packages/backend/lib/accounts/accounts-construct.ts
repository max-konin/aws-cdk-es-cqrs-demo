import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { aws_dynamodb } from 'aws-cdk-lib';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';

export class AccountsConstruct extends Construct {
  public mutationsResolver: NodejsFunction;
  public accountProjector: NodejsFunction;

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
      runtime: Runtime.NODEJS_18_X,
    });

    this.accountProjector = new NodejsFunction(this, 'projector', {
      environment: {
        ACCOUNTS_TABLE_NAME: this.accountsTable.tableName,
        EVENTS_TABLE_NAME: this.eventStore.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    });

    this.accountsTable.grantFullAccess(this.accountProjector);

    this.eventStore.grantFullAccess(this.mutationsResolver);
    this.eventStore.grantFullAccess(this.accountProjector); // TODO: DO NOT READ FROM EVENT STORE

    const sourceMapping = new DynamoEventSource(this.eventStore, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      bisectBatchOnError: true,
      retryAttempts: 10,
    });

    sourceMapping.bind(this.accountProjector);
  }
}
