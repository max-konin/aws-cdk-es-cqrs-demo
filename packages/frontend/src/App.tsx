import '@aws-amplify/ui-react/styles.css';
import AppRouter from './router/AppRouter';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/ui/Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 60000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Navbar />
        <AppRouter />
      </QueryClientProvider>
    </div>
  );
}

export default App;
