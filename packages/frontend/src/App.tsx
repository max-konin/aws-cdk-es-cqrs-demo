import { useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './components/AppRouter';
import { Auth } from 'aws-amplify';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/ui/Navbar';
import { useUserStore } from './store/user';

function App() {
  const setIsAuth = useUserStore((state) => state.setIsAuth);
  const setIsLoading = useUserStore((state) => state.setIsLoading);

  const checkLogin = async () => {
    setIsLoading(true);
    const user = await Auth.currentUserInfo();
    if (user) {
      setIsAuth(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkLogin().catch(console.error);
  }, []);

  return (
    <div className="app">
      <CssBaseline />
      <Navbar />
      <AppRouter />
    </div>
  );
}

export default App;
