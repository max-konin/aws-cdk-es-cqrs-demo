import Dashboard from '../pages/Dashboard';
import Shipments from '../pages/Shipments';

export const privateRoutes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/shipments',
    element: <Shipments />,
  },
];
