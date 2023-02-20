import {
  AuthorizationType,
  GraphqlApi,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export const initGraphqlApi = (
  scope: Construct,
  userPool: cognito.UserPool
) => {
  return new GraphqlApi(scope, 'Api', {
    name: 'cqrs-demo-api',
    schema: SchemaFile.fromAsset('graphql/schema.graphql'),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: AuthorizationType.USER_POOL,
        userPoolConfig: {
          userPool: userPool,
        },
      },
    },
    xrayEnabled: true,
  });
};
