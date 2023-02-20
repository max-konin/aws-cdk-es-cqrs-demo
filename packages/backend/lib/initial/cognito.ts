import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as customResources from 'aws-cdk-lib/custom-resources';
import { Stack } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';

export const initUserPool = (scope: Construct) => {
  return new cognito.UserPool(scope, 'demo-userpool', {
    userPoolName: 'demo-user-pool',
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    standardAttributes: {},
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
};

export const initUserPoolClient = (
  scope: Construct,
  userPool: cognito.UserPool
) => {
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

  const clientReadAttributes = new cognito.ClientAttributes()
    .withStandardAttributes(standardCognitoAttributes)
    .withCustomAttributes('custom:tenantId');

  const clientWriteAttributes = new cognito.ClientAttributes()
    .withStandardAttributes({
      ...standardCognitoAttributes,
      emailVerified: false,
      phoneNumberVerified: false,
    })
    .withCustomAttributes('custom:tenantId');

  return new cognito.UserPoolClient(scope, 'userpool-client', {
    userPool,
    authFlows: {
      userPassword: true,
      custom: true,
      userSrp: true,
    },
    supportedIdentityProviders: [
      cognito.UserPoolClientIdentityProvider.COGNITO,
    ],
    readAttributes: clientReadAttributes,
    writeAttributes: clientWriteAttributes,
  });
};

export const initAuthRole = (
  scope: Construct,
  bucketName: string,
  identityPoolId: string
) => {
  const principalTag = '${aws:PrincipalTag/tenantId}';
  const authPolicyDocument = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          's3:PutObject',
          's3:Abort*',
          's3:DeleteObject*',
          's3:GetBucket*',
          's3:GetObject*',
          's3:List*',
          's3:PutObject',
          's3:PutObjectLegalHold',
          's3:PutObjectRetention',
          's3:PutObjectTagging',
          's3:PutObjectVersionTagging',
        ],
        resources: [`arn:aws:s3:::${bucketName}/public/${principalTag}/*`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:List*'],
        resources: [
          `arn:aws:s3:::${bucketName}`,
          `arn:aws:s3:::${bucketName}/*`,
        ],
      }),
    ],
  });

  const authPolicyProperty: iam.CfnRole.PolicyProperty = {
    policyDocument: authPolicyDocument,
    policyName: 'AuthRoleAccessPolicy',
  };

  const authRole = new iam.CfnRole(scope, 'CognitoAuthRole', {
    // roleName: 'CognitoIdentityPoolRole-Authorized',
    assumeRolePolicyDocument: {
      Statement: [
        {
          Effect: iam.Effect.ALLOW,
          Action: ['sts:AssumeRoleWithWebIdentity', 'sts:TagSession'],
          Condition: {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPoolId,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          Principal: {
            Federated: 'cognito-identity.amazonaws.com',
          },
        },
      ],
    },
    policies: [authPolicyProperty],
  });

  const unAuthRole = new iam.CfnRole(scope, 'CognitoUnAuthRole', {
    // roleName: 'CognitoIdentityPoolRole-Unauthorized',
    assumeRolePolicyDocument: {
      Statement: [
        {
          Effect: iam.Effect.ALLOW,
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPoolId,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          Principal: {
            Federated: 'cognito-identity.amazonaws.com',
          },
        },
      ],
    },
  });

  new cognito.CfnIdentityPoolRoleAttachment(scope, 'defaultRoles', {
    identityPoolId,
    roles: {
      authenticated: authRole.attrArn,
      unauthenticated: unAuthRole.attrArn,
    },
  });
};

export const addPrincipalTags = (
  scope: Construct,
  bucketName: string,
  identityPoolId: string,
  userPoolProviderName: string
) => {
  const createParameters = {
    IdentityPoolId: identityPoolId,
    IdentityProviderName: userPoolProviderName,
    PrincipalTags: {
      tenantId: 'custom:tenantId',
    },
    UseDefaults: false,
  };

  const setPrincipalTagAction = {
    action: 'setPrincipalTagAttributeMap',
    service: 'CognitoIdentity',
    parameters: createParameters,
    physicalResourceId: customResources.PhysicalResourceId.of(identityPoolId),
  };

  const { region, account } = Stack.of(scope);
  const identityPoolArn = `arn:aws:cognito-identity:${region}:${account}:identitypool/${identityPoolId}`;
  new customResources.AwsCustomResource(scope, 'CustomResourcePrincipalTags', {
    onCreate: setPrincipalTagAction,
    onUpdate: setPrincipalTagAction,
    policy: customResources.AwsCustomResourcePolicy.fromSdkCalls({
      resources: [identityPoolArn],
    }),
  });
};

export const initIdentityPool = (
  scope: Construct,
  userPoolClient: cognito.UserPoolClient,
  userPool: cognito.UserPool
) => {
  const cognitoIdentityProviderProperty: cognito.CfnIdentityPool.CognitoIdentityProviderProperty =
    {
      clientId: userPoolClient.userPoolClientId,
      providerName: userPool.userPoolProviderName,
    };

  return new cognito.CfnIdentityPool(scope, 'tl-identity-pool2', {
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [cognitoIdentityProviderProperty],
  });
};
