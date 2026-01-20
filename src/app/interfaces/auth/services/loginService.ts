import { api } from "../../../stores/api";

// Define the login request payload interface
export interface LoginRequest {
    email: string;
    secret_code?: string;
}

// Define the login response interface
export interface LoginResponse {
    status: string; // API returns "true" or "false"
    statusCode: number;
    message: string;
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role_id: number;
            role_name: string;
        };
        access_token: string;
        refresh_token: string;
    };
    error?: {
        status: number;
        data: {
            status: string;
            statusCode: number;
            message: string;
        };
    };
}


// Define the forgot password request payload interface
export interface EmailVerificationRequest {
    email: string;
}

// Define the forgot password response interface
export interface EmailVerificationResponse {
    status: string; // API returns "true" or "false"
    statusCode: number;
    message: string;
    error?: {
        status: number;
        data: {
            status: string;
            statusCode: number;
            message: string;
        };
    };
}

// Inject login endpoints into the main API
export const loginService = api.injectEndpoints({
    endpoints: (builder) => ({
        // Login mutation endpoint
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
        }),

        // Email verfication mutation endpoint
        emailVerification: builder.mutation<EmailVerificationResponse, EmailVerificationRequest>({
            query: (data) => ({
                url: "auth/email_verification",
                method: "POST",
                body: data,
            }),
        }),

    }),
});

// Export hooks for usage in components
export const {
    useLoginMutation,
    useEmailVerificationMutation,
} = loginService;
