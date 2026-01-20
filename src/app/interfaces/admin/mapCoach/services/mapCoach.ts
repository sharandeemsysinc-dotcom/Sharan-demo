import { api } from "../../../../stores/api";

export const mapCoachAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Create Coach Request
        createCoachRequest: builder.mutation({
            query: (data) => ({
                url: "coachRequest/coachRequestbyClient",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Get All Coach Requests
        getAllCoachRequest: builder.query({
            query: (data) => ({
                url: "coachRequest/getAllCoachRequest",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),

        // Get Coach Request by ID
        getCoachRequestById: builder.query({
            query: (id) => `coachRequest/getCoachRequestbyId/${id}`,
        }),

        // Update Coach Request
        updateCoachRequest: builder.mutation({
            query: ({ id, data }) => ({
                url: `coach_request/update_coach_request/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Enable / Disable Coach Request
        enableDisableCoachRequest: builder.mutation({
            query: ({ id, data }) => ({
                url: `coach_request/enable_disable_coach_request/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Delete Coach Request
        deleteCoachRequest: builder.mutation({
            query: (id) => ({
                url: `coach_request/delete_coach_request/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Approve / Reject Coach Request
        approveRejectCoachRequest: builder.mutation({
            query: (data) => ({
                url: "coach_request/approve_reject_coach_request",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Assign Coach to Client
        assignCoachToClient: builder.mutation({
            query: (data) => ({
                url: "coach/assign_coach_with_client",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

         // Unassign Coach to Client
        unassignCoachToClient: builder.mutation({
            query: (data) => ({
                url: "coach/unassigned_coach",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Get Coach Request by ID
        getAssignedCoachToClient: builder.mutation({
            query: (data) => ({
                url: "coach/get_assigned_coach",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Map Client to Coach
        mapcilenttoCoach: builder.mutation({
            query: (data) => ({
                url: "coach/map_client",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CoachRequest"],
        }),

        // Get rejected reason from client for particular coach
        getReasonFromClientForCoach: builder.query({
            query: (data) => ({
                url: "coachRequest/getRejectedList",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            })
        })
    }),
});

export const {
    useCreateCoachRequestMutation,
    useGetAllCoachRequestQuery,
    useGetCoachRequestByIdQuery,
    useUpdateCoachRequestMutation,
    useEnableDisableCoachRequestMutation,
    useDeleteCoachRequestMutation,
    useApproveRejectCoachRequestMutation,
    useAssignCoachToClientMutation,
    useUnassignCoachToClientMutation,
    useGetAssignedCoachToClientMutation,
    useMapcilenttoCoachMutation,
    useGetReasonFromClientForCoachQuery,
} = mapCoachAPI;
