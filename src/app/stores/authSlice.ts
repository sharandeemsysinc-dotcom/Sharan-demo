// This helps to create a slice of the Redux state with reducers and actions automatically
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";

// Define the authentication state interface
interface AuthState {
    userId: string | null;
    loginId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    scope: string | null;
}

// Define the payload interface for setCredentials action
interface SetCredentialsPayload {
    accessToken: string;
    refreshToken: string;
    userId: string;
    loginId: string;
    scope: string;
}

// Define the payload interface for setAccessToken action
interface SetAccessTokenPayload {
    accessToken: string;
}

// Create an authentication slice using Redux Toolkit
const authSlice = createSlice({
    // The name of this slice — used as a key in the Redux store
    name: 'auth',

    // Initial state for authentication-related data
    initialState: {
        userId: null,
        loginId: null,
        accessToken: null,
        refreshToken: null,
        scope: null
    } as AuthState,

    // Reducer functions define how the state changes in response to actions
    reducers: {
        /**
         * setCredentials
         * Called when user logs in or credentials are refreshed.
         * Updates all authentication fields in the state.
         */
        setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
            const { accessToken, refreshToken, scope, userId, loginId } = action.payload;
            state.userId = userId;
            state.loginId = loginId;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.scope = scope;
        },

        /**
         * setAccessToken
         * Updates only the access token (used when token refresh occurs).
         */
        setAccessToken: (state, action: PayloadAction<SetAccessTokenPayload>) => {
            const { accessToken } = action.payload;
            state.accessToken = accessToken;
        },

        /**
         * logOut
         * Clears all authentication data from state and localStorage.
         * Also resets the RTK Query API cache.
         */
        logOut: (state) => {
            // Clear all persisted data
            localStorage.removeItem('persist:root');
            localStorage.clear();

            // Reset Redux state fields
            state.userId = null;
            state.loginId = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.scope = null;

            // Clear RTK Query cache to prevent stale data after logout
            api.util.resetApiState();
        }
    }
});

// Export the reducer to be used in the Redux store
export default authSlice.reducer;

// Export actions to dispatch them from components or thunks
export const { setCredentials, logOut, setAccessToken } = authSlice.actions;

// Selectors — used to access specific pieces of state from components
export const selectUserId = (state: any) => state.auth.userId;
export const selectLoginId = (state: any) => state.auth.loginId;
export const selectCurrentScope = (state: any) => state.auth.scope;
export const selectCurrentAccessToken = (state: any) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state: any) => state.auth.refreshToken;
export const selectCurrentPartnerId = (state: any) => state.auth.partnerId;
export const selectCurrentEmployeeId = (state: any) => state.auth.employeeId;
