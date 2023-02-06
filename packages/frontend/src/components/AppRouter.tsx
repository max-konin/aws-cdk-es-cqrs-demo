import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '@aws-amplify/ui-react';

const AppRouter = () => {
  const { isAuth, isLoading } = useContext(AuthContext);

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
