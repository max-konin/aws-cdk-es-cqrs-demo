import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './components/AppRouter';
import { AuthContext } from './context/AuthContext';
import { Auth } from 'aws-amplify';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/ui/Navbar';

const theme = createTheme();
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
    checkLogin().catch(console.error);
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
