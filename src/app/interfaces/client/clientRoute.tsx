import Register from "../auth/UI/ClientRegister";
import ClientRequired from "./ClientRequired";

// Lazy imports
// const Coach = lazy(() => import("./coach/UI/Coach"));
// const CoachForm = lazy(() => import("./coach/UI/CoachForm"));

export const ClientRoutes = [
  {
    path: "/client",
    element: <ClientRequired />,
    children: [
      // { path: "Coach", element: <Coach /> },
      // { path: "CoachForm", element: <CoachForm /> }
        { path: "coach/form/:id", element: <Register /> },
    ],
  },
];
