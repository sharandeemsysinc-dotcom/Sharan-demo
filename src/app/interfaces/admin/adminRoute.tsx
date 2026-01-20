import AdminRequired from "./AdminRequired";
import { Staff, StaffForm, StaffDetails } from "./staff";
import { Coach, CoachDetails } from "./coach";
import { Subscription, SubscriptionForm } from "./subscription";
import { Client, ClientDetails, PaymentHistory } from "./client";
import { SubscriptionHistory } from "./subscriptionHistory";
import { MapCoach, MapCoachDetails } from "./mapCoach";

export const AdminRoutes = [
  {
    path: "/admin",
    element: <AdminRequired />,
    children: [
      { path: "staff", element: <Staff /> },
      { path: "staff/form", element: <StaffForm /> },
      { path: "staff/form/:id", element: <StaffForm /> },
      { path: "staff/details/:id", element: <StaffDetails /> },
      { path: "coach", element: <Coach /> },
      { path: "coach/details/:id", element: <CoachDetails /> },
      { path: "coach/details/:page/:id", element: <CoachDetails /> },
      { path: "approveCoach", element: <Coach /> },
      { path: "client", element: <Client /> },
      { path: "client/details/:id", element: <ClientDetails /> },
      { path: "client/profile/:id", element: <ClientDetails /> },
      { path: "subscription/form", element: <SubscriptionForm /> },
      { path: "subscription/form/:id", element: <SubscriptionForm /> },
      { path: "subscription", element: <Subscription /> },
      { path: "subscriptionHistory", element: <SubscriptionHistory /> },
      { path: "mapCoach/details/:id", element: <MapCoachDetails /> },
      { path: "mapCoach", element: <MapCoach /> },
      { path: "mapCoach/details/:id", element: <MapCoachDetails /> },
      { path: "paymentHistory", element: <PaymentHistory /> }
    ],
  },
];


