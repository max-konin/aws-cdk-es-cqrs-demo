/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify, Auth } from 'aws-amplify';
import App from './App';
import './index.css';
import Params from '../../backend/cdk-outputs.json';
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'd985f822-cfa9-465d-b7bb-630935586746',
  clientToken: 'pub473080d50438d2d41d21532b24ca6963',
  site: 'datadoghq.com',
  service: 'demo',
  env: 'dev',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100, // if not included, the default is 100
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
});

datadogRum.startSessionReplayRecording();

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
