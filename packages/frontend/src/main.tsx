import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import './index.css';

Amplify.configure({
  aws_appsync_region: 'us-west-2', // Stack region
  aws_appsync_graphqlEndpoint: 'http://localhost:4566/graphql/417964d6', // AWS AppSync endpoint
  aws_appsync_authenticationType: 'API_KEY', //Primary AWS AppSync authentication type
  aws_appsync_apiKey: 'ec77503d', // AppSync API Key
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
