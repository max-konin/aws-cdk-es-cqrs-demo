import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './components/AppRouter';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Auth } from 'aws-amplify';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await Auth.currentUserInfo();
      console.log('user: ', user);
      if (user) {
        setIsAuth(true);
      }
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <CssBaseline />
        <AuthContext.Provider
          value={{
            isAuth,
            setIsAuth,
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
