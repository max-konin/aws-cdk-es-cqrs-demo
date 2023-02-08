import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import { Loader } from '@aws-amplify/ui-react';
import { useUserStore } from '../store/user';

const AppRouter = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  const isLoading = useUserStore((state) => state.isLoading);

  if (isLoading) {
    return <Loader />;
  }

  const routes = isAuth ? privateRoutes : publicRoutes;
  const redirectTo = isAuth ? '/' : '/login';

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} element={route.element} path={route.path} />
      ))}
      <Route path="*" element={<Navigate to={redirectTo} replace />} />
    </Routes>
  );
};

export default AppRouter;
