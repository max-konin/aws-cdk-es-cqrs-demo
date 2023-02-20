import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';

export const useLogout = () => {
  const { enqueueSnackbar } = useSnackbar();

  const logoutCb = async () => {
    try {
      await Auth.signOut();
    } catch (error: unknown) {
      enqueueSnackbar(`Error signing out: ${error as string}`, {
        variant: 'error',
      });
    }
  };

  return logoutCb;
};
