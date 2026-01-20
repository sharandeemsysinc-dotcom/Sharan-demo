// Import core RTK Query utilities for API creation and base queries
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Import logout and access token update actions from the auth slice
import { logOut, setAccessToken as untypedSetAccessToken } from "./authSlice";

// Since `setAccessToken` action is not typed, we assign it as `any` to avoid TS errors.
// This can be properly typed later if desired.
const setAccessToken: any = untypedSetAccessToken;

// Define a TypeScript interface for the refresh token response payload
// The backend is expected to return a new access_token (and optionally a refresh_token)
interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
}

// -------------------------------------------------------------
// Base query configuration
// -------------------------------------------------------------
// `fetchBaseQuery` is a small wrapper around `fetch` that handles
// request creation, headers, and basic error handling automatically.
const baseQuery = fetchBaseQuery({
  // Base API URL (loaded from environment variable)
  baseUrl: import.meta.env.VITE_API_URL,

  // This runs before each request to attach headers such as the authorization token
  prepareHeaders: (headers, { getState }) => {
    // Get the access token from the Redux auth slice
    const token = (getState() as any).auth?.accessToken;

    // If token exists, attach it to the `Authorization` header
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // Return the modified headers
    return headers;
  },
});

// -------------------------------------------------------------
// Base query with automatic re-authentication (token refresh logic)
// -------------------------------------------------------------
// This wraps the base query to intercept 401 (unauthorized) errors
// and automatically attempt token refresh using the refresh token.
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Execute the original API request
  let result = await baseQuery(args, api, extraOptions);

  // If the server responds with a 401, try refreshing the token
  if (result?.error?.status === 401) {
    // Get refresh token from Redux state
    const refreshToken = (api.getState() as any).auth?.refreshToken;

    if (refreshToken) {
      // Prepare request body for the refresh endpoint
      const data = { refresh_token: refreshToken };

      // Send a POST request to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/refresh",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        },
        api,
        extraOptions
      );

      // Parse the response data
      const refreshData = refreshResult.data as RefreshResponse | undefined;

      // If a new access token is returned, store it and retry the original request
      if (refreshData?.access_token) {
        // Update Redux state with the new token
        api.dispatch(setAccessToken(refreshData.access_token));

        // Retry the original API call with the refreshed token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh failed, force logout
        api.dispatch(logOut());
      }
    } else {
      // If no refresh token exists, logout immediately
      api.dispatch(logOut());
    }
  }

  // Return the final API response
  return result;
};

// -------------------------------------------------------------
// Main API Definition
// -------------------------------------------------------------
// This creates a reusable RTK Query API instance that can inject endpoints.
// All feature services (like `publicService.ts`, `userService.ts`, etc.)
// will use this `api` as the base.
export const api = createApi({
  // Use our wrapped base query with re-auth logic
  baseQuery: baseQueryWithReauth,

  // Define tag types for cache invalidation and data updates
  tagTypes: [
    "Employee",
    "Staffs",
    "Coach",
    "Client",
    "CoachRequest",
    "WorkingHours",
    "Feedback"
  ],

  // Placeholder for all API endpoints (injected later)
  endpoints: () => ({}),

  // Cache and refetch configurations
  keepUnusedDataFor: 300, // cache duration in seconds
  refetchOnMountOrArgChange: false, // disable auto refetch on re-mount
  refetchOnFocus: false, // disable refetch when window gains focus
  refetchOnReconnect: true, // enable refetch when connection is restored
});
