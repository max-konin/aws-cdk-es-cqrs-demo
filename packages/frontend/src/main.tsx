import { createRoot } from 'react-dom/client';
import { Amplify, Auth } from 'aws-amplify';
import App from './App';
import './index.css';
import Params from '../../backend/cdk-outputs.json';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@aws-amplify/ui-react/styles.css';
import AppAuthenticator from './components/auth/AppAuthenticator';
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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Amplify.configure({
  aws_appsync_region: Params.BackendStack.StackRegion,
  aws_appsync_graphqlEndpoint: Params.BackendStack.GraphQLAPIURL,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: Params.BackendStack.GraphQLAPIKey,
  Auth: {
    userPoolId: 'us-east-1_FVsZHqkAA',
    authenticationFlowType: 'USER_SRP_AUTH',
    userPoolWebClientId: '21ss6ea1eiodndg43tiet0e67u',
    identityPoolId: 'us-east-1:011c8bcb-3923-4d7b-b661-ba04cfa374a0',
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
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */

const theme = createTheme();
Auth.configure();

createRoot(document.getElementById('root') as HTMLElement).render(
  <AppAuthenticator>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </AppAuthenticator>
);
