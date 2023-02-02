import { createContext } from "react";

export interface AuthContextProps {
  isAuth: boolean;
  setIsAuth: (auth: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  setIsAuth: () => {},
});