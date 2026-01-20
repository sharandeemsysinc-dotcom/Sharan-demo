import { api } from "../../../../stores/api";

// ---------------
// TYPES
// ---------------
export interface Subscription {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: number;
    active: boolean;
    status: number;
}

export interface CreateSubscriptionInput {
    name: string;
    description: string;
    currency: number;
    amount: number;
}

export interface UpdateSubscriptionInput {
    name?: string;
    description?: string;
    amount?: number;
    currency?: number;
    active?: boolean;
    status?: number;
}


// ---------------
// API
// ---------------
export const subscriptionAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // CREATE
        createSubscription: builder.mutation<Subscription, CreateSubscriptionInput>({
            query: (data) => ({
                url: "subscription/create_subscription",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data, // <-- FIX
        }),

        // GET ALL
        getAllSubscriptionHistory: builder.query<any, any>({
            query: (filters) => ({
                url: "coach/get_coach_subscription_histroy",
                method: "POST",
                body: filters,
            }),
            transformResponse: (response: any) => response.data, // <-- FIX
        }),

    }),
});

export const {
    useCreateSubscriptionMutation,
    useGetAllSubscriptionHistoryQuery
} = subscriptionAPI;
