import { useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './router/AppRouter';
import { Auth } from 'aws-amplify';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/ui/Navbar';
import { useUserStore } from './store/user';
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
  const setIsAuth = useUserStore((state) => state.setIsAuth);
  const setIsLoading = useUserStore((state) => state.setIsLoading);

  const checkLogin = async () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await Auth.currentUserInfo();
    if (user) {
      setIsAuth(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    checkLogin().catch(console.log);
  }, []);

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
