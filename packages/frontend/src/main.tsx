/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify, Auth } from 'aws-amplify';
import App from './App';
import './index.css';
import Params from '../../backend/cdk-outputs.json';

Amplify.configure({
  aws_appsync_region: Params.BackendStack.StackRegion,
  aws_appsync_graphqlEndpoint: Params.BackendStack.GraphQLAPIURL,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: Params.BackendStack.GraphQLAPIKey,
  Auth: {
    userPoolId: Params.BackendStack.UserPullId,
    authenticationFlowType: 'USER_SRP_AUTH',
    userPoolWebClientId: Params.BackendStack.UserPoolClientId,
    identityPoolId: Params.BackendStack.IdentityPoolId,
    region: Params.BackendStack.StackRegion,
    identityPoolRegion: Params.BackendStack.StackRegion,
  },
  Storage: {
    AWSS3: {
      bucket: Params.BackendStack.DocumentsBucket, //REQUIRED -  Amazon S3 bucket name
      region: Params.BackendStack.StackRegion,
    },
  },
  API: {
    graphql_headers: async () => {
      const session = await Auth.currentSession();
      return {
        Authorization: session.getIdToken().getJwtToken(),
      };
    },
  },
});

Auth.configure();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
