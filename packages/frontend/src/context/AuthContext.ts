import { createContext } from 'react';

export interface AuthContextProps {
  isAuth: boolean;
  isLoading: boolean;
  setIsAuth: (auth: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsAuth: () => {},
});
