import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './components/AppRouter';
import { AuthContext } from './context/AuthContext';
import { Auth } from 'aws-amplify';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/ui/Navbar';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLogin = async () => {
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
      <CssBaseline />
      <AuthContext.Provider
        value={{
          isAuth,
          setIsAuth,
          isLoading,
        }}
      >
        <Navbar />
        <AppRouter />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
