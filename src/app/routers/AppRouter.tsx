import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminRoutes } from "../interfaces/admin/adminRoute";
import { CoachRoutes } from "../interfaces/coach/coachRoute";
import { ClientRoutes } from "../interfaces/client/clientRoute";
import { StaffRoutes } from "../interfaces/staff/staffRoute";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { selectCurrentAccessToken, selectCurrentScope } from "../stores/authSlice";
import { Navigate } from "react-router-dom";
import Login from "../interfaces/auth/UI/login";
import CoachRegister from "../interfaces/auth/UI/CoachRegister";
import Register from "../interfaces/auth/UI/ClientRegister";
import Layout from "../../shared/layout/sidebarLayout";
import CoachRegisterNew from "../interfaces/auth/UI/coachRegisterNew";

function AppRouter() {
  const accessToken = useSelector(selectCurrentAccessToken);
  const scope = useSelector(selectCurrentScope);

  const getCurrentUrl = () => {
    if (scope === 'Admin') return '/admin/'
    if (scope === 'Coach') return '/coach/'
    if (scope === 'Client') return '/client/'
    if (scope === 'Staff') return '/staff/'

    return '/auth/login' // Default fallback
  }
  const routes = createBrowserRouter([

    { path: "/", element: <Navigate to={accessToken ? getCurrentUrl() : "/auth/login"} replace /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/forgot-password", element: <Login /> },
    { path: "/auth/client/register", element: <Register /> },
    { path: "/auth/coach/register", element: <CoachRegisterNew /> },
    { path: "client/form/:id", element: <Register /> },
    { path: "coach/form/:index", element: <CoachRegister /> },
     { path: "coach/form", element: <CoachRegister /> },

    // All interface routes
    ...CoachRoutes,
    ...AdminRoutes,
    ...ClientRoutes,
    ...StaffRoutes,

    // 404 route
    {
      path: "*",
      // element: (
      //   <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
      //     <div className="container">
      //       <div className="row">
      //         <div className="col-12 text-center">
      //           <h2 className="d-flex justify-content-center align-items-center">
      //             <span className="display-1 fw-bold">404</span>
      //           </h2>
      //           <h3 className="h2 mb-2">PAGE NOT FOUND !</h3>
      //           <p className="mb-5">
      //             The page you are looking for was not found.
      //           </p>
      //           <a
      //             href="/"
      //             className="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6"
      //           >
      //             Back to Home
      //           </a>
      //         </div>
      //       </div>
      //     </div>
      //   </section>
      // ),
      element: (
        <Layout />
      )
    },
  ]);

  return (<Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={routes} />
  </Suspense>);
}

export default AppRouter;
