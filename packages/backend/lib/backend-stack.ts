import * as cdk from 'aws-cdk-lib';
import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import { AccountsConstruct } from './accounts/accounts-construct';
import {
  addPrincipalTags,
  initAuthRole,
  initIdentityPool,
  initUserPool,
  initUserPoolClient,
} from './initial/cognito';
import { initDocumentsBucket } from './initial/s3';
import { initDynamoDb } from './initial/dynamodb';
import { initGraphqlApi } from './initial/graphql';
import { Datadog } from 'datadog-cdk-constructs-v2';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = initUserPool(this);
    const userPoolClient = initUserPoolClient(this, userPool);
    const identityPool = initIdentityPool(this, userPoolClient, userPool);
    const documentsBucket = initDocumentsBucket(this);

    initAuthRole(this, documentsBucket.bucketName, identityPool.ref);
    addPrincipalTags(
      this,
      documentsBucket.bucketName,
      identityPool.ref,
      userPool.userPoolProviderName
    );

    const { eventStore, accountsTable } = initDynamoDb(this);

    const accounts = new AccountsConstruct(
      this,
      'accounts',
      eventStore,
      accountsTable
    );

    const api = initGraphqlApi(this, userPool);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
    });

    // Prints out the AppSync GraphQL API ID to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIID', {
      value: api.apiId || '',
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, 'Stack Region', {
      value: this.region,
    });

    // Prints Cognito Pool Id
    new cdk.CfnOutput(this, 'UserPullId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref,
    });

    new cdk.CfnOutput(this, 'DocumentsBucket', {
      value: documentsBucket.bucketName,
    });

    const accountsMutationsDS = api.addLambdaDataSource(
      'accountsDS',
      accounts.mutationsResolver
    );

    accountsMutationsDS.createResolver('openAccount', {
      typeName: 'Mutation',
      fieldName: 'openAccount',
      requestMappingTemplate: MappingTemplate.lambdaRequest(
        '$util.toJson($context)'
      ),
    });
    accountsMutationsDS.createResolver('creditAccount', {
      typeName: 'Mutation',
      fieldName: 'creditAccount',
    });
    accountsMutationsDS.createResolver('debitAccount', {
      typeName: 'Mutation',
      fieldName: 'debitAccount',
    });

    const accountsDynamoDataSource = api.addDynamoDbDataSource(
      'AccountsTableDS',
      accountsTable
    );

    accountsDynamoDataSource.createResolver('getAllAccounts', {
      typeName: 'Query',
      fieldName: 'getAllAccounts',
      requestMappingTemplate: MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "operation": "Query",
        "query": {
          "expression": "#tenantId = :tenantId",
          "expressionNames": {
            "#tenantId": "tenantId"
          },
          "expressionValue": {
            ":tenantId": $util.dynamodb.toDynamoDBJson($ctx.identity.claims.get("custom:tenantId"))
          }
        }
      }`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    const datadog = new Datadog(this, 'Datadog', {
      apiKey: '6ece7654-59b6-4408-a9a0-c526f510248c',
      enableDatadogTracing: true,
      enableMergeXrayTraces: true,
      enableDatadogLogs: true,
      injectLogContext: true,
      logLevel: 'debug',
      env: 'dev',
      tags: 'project:demo',
      site: 'datadoghq.com',
    });
    datadog.addLambdaFunctions([
      accounts.mutationsResolver,
      accounts.accountProjector,
    ]);
  }
}
