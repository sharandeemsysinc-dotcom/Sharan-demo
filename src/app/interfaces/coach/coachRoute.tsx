import { Client } from "../admin/client";
import { CoachDetails } from "../admin/coach";
import { SubscriptionHistory } from "../admin/subscriptionHistory/UI/SubscriptionHistory";
import { AppointmentHistoyTab } from "./appointmentHistory/UI/AppointmentHistoyTab";
import CoachRequired from "./CoachRequired";
import CoachRegister from "../auth/UI/CoachRegister";

export const CoachRoutes = [
  {
    path: "/coach",
    element: <CoachRequired />,
    children: [
      { path: "appointmentHistory", element: <AppointmentHistoyTab /> },
      { path: "details/:page", element: <CoachDetails /> },
      { path: "client", element: <Client /> },
      { path: "subscriptionHistory", element: <SubscriptionHistory /> },
      { path: "coach/form/:id", element: <CoachRegister /> },
    ]
  }
];
