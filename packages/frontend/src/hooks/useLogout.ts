import { Auth } from 'aws-amplify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

export const useLogout = () => {
  const { setIsAuth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const logoutCb = async () => {
    try {
      await Auth.signOut();
      setIsAuth(false);
    } catch (error: unknown) {
      enqueueSnackbar(`Error signing out: ${error as string}`, {
        variant: 'error',
      });
    }
  };

  return logoutCb;
};
