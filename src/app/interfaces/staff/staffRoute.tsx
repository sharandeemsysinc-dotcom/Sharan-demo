import StaffRequired from "./StaffRequired";
import { Coach, CoachDetails } from "../admin/coach";
import { Subscription, SubscriptionForm } from "../admin/subscription";
import { Client, ClientDetails } from "../admin/client";
import { SubscriptionHistory } from "../admin/subscriptionHistory/UI/SubscriptionHistory";
import { MapCoachDetails, MapCoach } from "../admin/mapCoach";

export const StaffRoutes = [
  {
    path: "/staff",
    element: <StaffRequired />,
    children: [
      { path: "coach", element: <Coach /> },
      { path: "coach/details/:id", element: <CoachDetails /> },
      { path: "coach/details/:page/:id", element: <CoachDetails /> },
      { path: "approveCoach", element: <Coach /> },
      { path: "subscription/form", element: <SubscriptionForm /> },
      { path: "subscription/form/:id", element: <SubscriptionForm /> },
      { path: "subscription", element: <Subscription /> },
      { path: "client", element: <Client /> },
      { path: "client/details/:id", element: <ClientDetails /> },
      { path: "subscriptionHistory", element: <SubscriptionHistory /> },
      { path: "mapCoach/details/:id", element: <MapCoachDetails /> },
      { path: "mapCoach", element: <MapCoach /> },
      { path: "mapCoach/details/:id", element: <MapCoachDetails /> },
    ]
  }
];
