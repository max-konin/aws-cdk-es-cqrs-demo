import Login from "../pages/Login";
import React from "react";
import SignUp from "../pages/SignUp";

export const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
];