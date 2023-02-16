import { Navigate, Route, Routes } from 'react-router-dom';
import { privateRoutes } from './private';

const AppRouter = () => {
  return (
    <Routes>
      {privateRoutes.map((route) => (
        <Route key={route.path} element={route.element} path={route.path} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
