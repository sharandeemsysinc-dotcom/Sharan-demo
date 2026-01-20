import { api } from "../../../../stores/api";

export const coachAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Create Coach
        createCoach: builder.mutation({
            query: (data) => ({
                url: "coach/create_coach",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),

        // Get All Coaches
        getAllCoach: builder.query({
            query: (data) => ({
                url: "coach/get_all_coach",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),


        // Get Coach by ID
        getCoachById: builder.mutation({
            query: (data) => ({
                url: "coach/get_coach_by_id",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),

        // Update Coach
        updateCoach: builder.mutation({
            query: ({ id, data }) => ({
                url: `coach/update_coach/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),

        // Enable / Disable Coach
        enableDisableCoach: builder.mutation({
            query: ({ id, data }) => ({
                url: `coach/enable_disable_coach/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),

        // Delete Coach
        deleteCoach: builder.mutation({
            query: (id) => ({
                url: `coach/delete_coach/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Coach"],
        }),

        // Approve / Reject Coach
        approveRejectCoach: builder.mutation({
            query: (data) => ({
                url: "coach/approve_reject_coach",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),

        // Assign / Unassign Coach to static site
        assignUnassignCoach: builder.mutation({
            query: (data) => ({
                url: "coach/assign_coach_static_site",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),

        // Activate - Rejected / Deleted Coach
        activateCoach: builder.mutation({
            query: (data) => ({
                url: "coach/activate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coach"],
        }),
    }),
});

export const {
    useCreateCoachMutation,
    useGetCoachByIdMutation,
    useGetAllCoachQuery,
    useUpdateCoachMutation,
    useEnableDisableCoachMutation,
    useDeleteCoachMutation,
    useApproveRejectCoachMutation,
    useAssignUnassignCoachMutation,
    useActivateCoachMutation
} = coachAPI;

