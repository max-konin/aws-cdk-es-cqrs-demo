import React, {useEffect, useState} from 'react';
import '@aws-amplify/ui-react/styles.css';
import AppRouter from "./components/AppRouter";
import {AuthContext} from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('auth')) {
      setIsAuth(true);
    }
  }, []);

  return (
      <div className="app">
        <AuthContext.Provider value={{
          isAuth,
          setIsAuth,
        }}>
          <Navbar/>
          <AppRouter />
        </AuthContext.Provider>
      </div>
  );
}

export default App;
