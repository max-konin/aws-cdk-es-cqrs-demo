import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify, Auth } from 'aws-amplify';
import App from './App';
import './index.css';
import Params from '../../backend/cdk-outputs.json';
import { BrowserRouter } from 'react-router-dom';

Amplify.configure({
  aws_appsync_region: Params.BackendStack.StackRegion,
  aws_appsync_graphqlEndpoint: Params.BackendStack.GraphQLAPIURL,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: Params.BackendStack.GraphQLAPIKey,
  Auth: {
    userPoolId: Params.BackendStack.UserPullId,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolWebClientId: Params.BackendStack.UserPoolClientId,
  },
});

Auth.configure();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
