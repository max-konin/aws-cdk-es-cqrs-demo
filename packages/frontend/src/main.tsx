import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import './index.css';

Amplify.configure({
  aws_appsync_region: 'us-west-2', // Stack region
  aws_appsync_graphqlEndpoint: 'https://2fwncb6jtnhn5p6ilq7ybe7c6m.appsync-api.us-east-1.amazonaws.com/graphql', // AWS AppSync endpoint
  aws_appsync_authenticationType: 'API_KEY', //Primary AWS AppSync authentication type
  aws_appsync_apiKey: 'da2-vdn7gfqrundorfkn3wuz4elnvy', // AppSync API Key
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
