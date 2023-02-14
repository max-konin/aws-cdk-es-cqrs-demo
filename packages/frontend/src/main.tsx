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
    userPoolId: 'us-east-1_dmJ7e7moi',
    authenticationFlowType: 'USER_SRP_AUTH',
    userPoolWebClientId: '6fkae6gmpvb0u8c38k8e95jo6h',
    identityPoolId: 'us-east-1:fb8cea0c-0372-4a63-a641-058d14ab6996',
    region: 'us-east-1',
  },
  Storage: {
    AWSS3: {
      bucket: 'backendstack-tldocumentsbucket4f1a8f77-tug0tnc9cqow', //REQUIRED -  Amazon S3 bucket name
      region: 'us-east-1', //OPTIONAL -  Amazon service region
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
