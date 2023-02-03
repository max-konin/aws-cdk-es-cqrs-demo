import { Auth } from 'aws-amplify';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export async function signIn(username: string, password: string) {
  const { setIsAuth } = useContext(AuthContext);
  try {
    const user = await Auth.signIn(username, password);
    console.log('user: ', user);
    setIsAuth(true);
    localStorage.setItem('auth', 'true');

  } catch (error) {
    console.log('error signing in', error);
  }
}
