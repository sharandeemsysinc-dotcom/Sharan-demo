import { api } from "../../../../stores/api";

// ---------------
// TYPES
// ---------------
export interface PlanType {
    plan_type_name: string;
    amount: number;
    currency: number;
}

export interface Subscription {
    id: string;
    plan_name: string;
    plan_type: PlanType[];
    active: boolean;
    status: number;
}

export interface CreateSubscriptionInput {
    plan_name: string;
    plan_type: PlanType[];
}

export interface UpdateSubscriptionInput {
    plan_name?: string;
    plan_type?: PlanType[];
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
        getAllSubscription: builder.query<any, any>({
            query: (filters) => ({
                url: "subscription/get_all_subscription",
                method: "POST",
                body: filters,
            }),
            transformResponse: (response: any) => response.data, // <-- FIX
        }),

        // GET BY ID
        getSubscriptionById: builder.query<Subscription, string>({
            query: (id) => `subscription/get_subscription_by_id/${id}`,
            transformResponse: (response: any) => response.data, // <-- FIX
        }),

        // UPDATE
        updateSubscription: builder.mutation<Subscription, { id: any; data: UpdateSubscriptionInput }>({
            query: ({ id, data }) => ({
                url: `subscription/update_subscription/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data, // <-- FIX
        }),

        // DELETE
        deleteSubscription: builder.mutation<Subscription, { id: any; data: UpdateSubscriptionInput }>({
            query: ({ id, data }) => ({
                url: `subscription/delete_subscription/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data ?? response, // <-- optional fix
        }),

        // UPDATE
        enableDisableSubscription: builder.mutation<Subscription, { id: any; data: UpdateSubscriptionInput }>({
            query: ({ id, data }) => ({
                url: `subscription/enable_disable_subscription/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data, // <-- FIX
        }),
    }),
});

export const {
    useCreateSubscriptionMutation,
    useGetAllSubscriptionQuery,
    useGetSubscriptionByIdQuery,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
    useEnableDisableSubscriptionMutation,
} = subscriptionAPI;
