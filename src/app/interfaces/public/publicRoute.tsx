// import React from "react";
// import PublicLayout from "../../../shared/layout/publicLayout";
import { Home } from "./UI/home";
import { About } from "./UI/about";
import Layout from "../../../shared/layout/sidebarLayout";
import LoginPage from "../auth/UI/login";
import ChangePassword from "../auth/UI/ChangePassword";
export const PublicRoutes = [
  {
    path: "/",
    // element: <Layout />,
    element: <Layout />,
    // element: <PublicLayout />,
    children: [
      { path: '/change-password', element: <ChangePassword /> },
      { path: "/", element: <Home /> },
      { path: "/employee/products", element: <About /> },
      { path: "/dashboard", element: <Home /> }, // Dashboard route after login
    ],
  },
  { path: "/login", element: <LoginPage /> }
];
