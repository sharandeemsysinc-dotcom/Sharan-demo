import { api } from "../../../../stores/api";

export const clientAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Create Client
        createClient: builder.mutation({
            query: (data) => ({
                url: "client/create_client",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Client"],
        }),

        // Get All Clients
        getAllClient: builder.query({
            query: (data) => ({
                url: "client/get_all_clients",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),

        // Get Client by ID (MUTATION)
        getClientById: builder.mutation({
            query: (data) => ({
                url: "client/get_client_by_id",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),

        // Update Client
        updateClient: builder.mutation({
            query: ({ id, data }) => ({
                url: `client/update_client/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Client"],
        }),

        // Enable / Disable Client
        enableDisableClient: builder.mutation({
            query: ({ id, data }) => ({
                url: `client/enable_disable_client/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Client"],
        }),

        // Delete Client
        deleteClient: builder.mutation({
            query: (id) => ({
                url: `client/delete_client/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Client"],
        }),

        // Approve / Reject Client
        approveRejectClient: builder.mutation({
            query: (data) => ({
                url: "client/approve_reject_client",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Client"],
        }),

        // Get All Client Payment History
        getClientPaymentHistory: builder.query({
            query: (data) => ({
                url: "client/get_all_client_payment_history",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            })
        }),

        // Get Client evaluarion for the particular coach
        getAllClientEvaluation: builder.query({
            query: (data) => ({
                url: "feedback/get_all_feedback",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateClientMutation,
    useGetClientByIdMutation,
    useGetAllClientQuery,
    useUpdateClientMutation,
    useEnableDisableClientMutation,
    useDeleteClientMutation,
    useApproveRejectClientMutation,
    useGetClientPaymentHistoryQuery,
    useGetAllClientEvaluationQuery
} = clientAPI;
