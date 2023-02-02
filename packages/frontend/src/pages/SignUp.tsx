import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import Link from "@mui/material/Link";


const Login = () => {
  const {setIsAuth} = useContext(AuthContext);

  const login = (e: any) => {
    e.preventDefault();
    setIsAuth(true);
    localStorage.setItem('auth', 'true');
  }

  return (
      <div>
        <h1>Sign Up</h1>
        <input type="text" placeholder="Enter your login"/>
        <input type="password" placeholder="Enter your password"/>
        <button onClick={login}>Enter</button>
        <Link href="/login" variant="body2">
          {"Sign In"}
        </Link>
      </div>
  );
};

export default Login;