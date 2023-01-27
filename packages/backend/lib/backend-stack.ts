import * as cdk from 'aws-cdk-lib';
import { SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { GraphqlApi, AuthorizationType } from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import { AccountsConstruct } from './accounts/accounts-construct';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accounts = new AccountsConstruct(this, 'accounts');

    // Creates the AppSync API
    const api = new GraphqlApi(this, 'Api', {
      name: 'cqrs-demo-api',
      schema: SchemaFile.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });
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

    const accountsMutationsDS = api.addLambdaDataSource(
      'accountsDS',
      accounts.mutationsResolver
    );

    accountsMutationsDS.createResolver('openAccount', {
      typeName: 'Mutation',
      fieldName: 'openAccount',
    });
    accountsMutationsDS.createResolver('creditAccount', {
      typeName: 'Mutation',
      fieldName: 'creditAccount',
    });
    accountsMutationsDS.createResolver('debitAccount', {
      typeName: 'Mutation',
      fieldName: 'debitAccount',
    });

    const accountsQueriesDS = api.addLambdaDataSource(
      'AccountsQueriesDS',
      accounts.queriesResolver
    );

    accountsQueriesDS.createResolver('getAllAccounts', {
      typeName: 'Query',
      fieldName: 'getAllAccounts',
    });
  }
}
