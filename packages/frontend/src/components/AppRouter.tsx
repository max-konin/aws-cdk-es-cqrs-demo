import React, { useContext } from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import {AuthContext} from "../context/AuthContext";

const AppRouter = () => {
  const {isAuth} = useContext(AuthContext);

  const routes = isAuth ? privateRoutes : publicRoutes;
  const redirectTo = isAuth ? "/" : "/login";

  return (
    <Routes>
      {routes.map(route =>
          <Route
              key={route.path}
              element={route.element}
              path={route.path}
          />
      )}
      <Route
          path="*"
          element={<Navigate to={redirectTo} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
