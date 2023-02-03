import Dashboard from '../pages/Dashboard';
import React from 'react';
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
