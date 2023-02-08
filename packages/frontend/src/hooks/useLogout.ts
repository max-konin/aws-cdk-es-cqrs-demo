
import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import { useUserStore } from '../store/user';

export const useLogout = () => {
  const setIsAuth = useUserStore((state) => state.setIsAuth);
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