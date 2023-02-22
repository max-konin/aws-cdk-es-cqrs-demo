import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Files from './components/files';
import Accounts from './components/Accounts';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Authenticator>
          {({ signOut, user }) => (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
              <hr />
              <Accounts />
              <hr />
              <Files />
            </main>
          )}
        </Authenticator>
      </QueryClientProvider>
    </div>
  );
}

export default App;
