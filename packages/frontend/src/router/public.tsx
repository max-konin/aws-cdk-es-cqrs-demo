import Login from '../pages/Login';
import React from 'react';
import SignUp from '../pages/SignUp';
import VerifyEmail from '../pages/VerifyEmail';

export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
];
