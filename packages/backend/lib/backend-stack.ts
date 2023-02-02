import * as cdk from 'aws-cdk-lib';
import { SchemaFile } from 'aws-cdk-lib/aws-appsync';
import {
  GraphqlApi,
  AuthorizationType,
  MappingTemplate,
} from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import { AccountsConstruct } from './accounts/accounts-construct';
import { aws_dynamodb } from 'aws-cdk-lib';
import { StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: 'my-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        tenantId: new cognito.StringAttribute({ mutable: false }),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 👇 User Pool Client attributes
    const standardCognitoAttributes = {
      givenName: true,
      familyName: true,
      email: true,
      emailVerified: true,
      address: true,
      birthdate: true,
      gender: true,
      locale: true,
      middleName: true,
      fullname: true,
      nickname: true,
      phoneNumber: true,
      phoneNumberVerified: true,
      profilePicture: true,
      preferredUsername: true,
      profilePage: true,
      timezone: true,
      lastUpdateTime: true,
      website: true,
    };

    const clientReadAttributes =
      new cognito.ClientAttributes().withStandardAttributes(
        standardCognitoAttributes
      );

    const clientWriteAttributes =
      new cognito.ClientAttributes().withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      });

    // 👇 User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'userpool-client', {
      userPool,
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userSrp: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });

    const eventStore = new aws_dynamodb.Table(this, 'EventStore', {
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

    const accounts = new AccountsConstruct(
      this,
      'accounts',
      eventStore,
      accountsTable
    );

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

    // Prints Cognito Pool Id
    new cdk.CfnOutput(this, 'UserPullId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
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
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(true),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
  }
}
