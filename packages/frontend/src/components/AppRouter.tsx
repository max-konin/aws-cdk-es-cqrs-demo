import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import { AuthContext } from '../context/AuthContext';
import { Auth } from 'aws-amplify';

const AppRouter = () => {
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const qwe3 = await Auth.currentUserInfo();
      console.log('qwe3: ', qwe3);
    };

    fetchData().catch(console.error);
  }, []);

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
