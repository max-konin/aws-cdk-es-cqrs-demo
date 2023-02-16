import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';

export const useDeleteUser = () => {
  const { enqueueSnackbar } = useSnackbar();

  const deleteUserCb = async () => {
    try {
      await Auth.deleteUser();
    } catch (error: unknown) {
      enqueueSnackbar(`Error deleting user: ${error as string}`, {
        variant: 'error',
      });
    }
  };

  return deleteUserCb;
};
