import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from './components/AppRouter';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Auth } from "aws-amplify";

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
    <div className="app">
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
  );
}

export default App;
