import { api } from '../../../../stores/api'

export const staffAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Save Staff
        saveStaff: builder.mutation({
            query: (data) => ({
                url: "staff/create_staff",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Staffs"],
        }),

        // Get All Staffs
        getAllStaffs: builder.query({
            query: (data) => ({
                url: "staff/get_all_staff",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
        }),

        // Get Staff by Id
         getStaffById: builder.mutation({
            query: (data) => ({
                url: "staff/get_staff_by_id",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Staffs"],
        }),

        // Update Staff
        updateStaff: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `staff/update_staff/${id}`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ["Staffs"],
        }),

        // Enable / Disable Staff
        enableDisableStaff: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `staff/enable_disable_staff/${id}`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ["Staffs"],
        }),

        // Delete Staff
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `staff/delete_staff/${id}`,
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Staffs"],
        })
    })
})

export const {
    useSaveStaffMutation,
    useGetAllStaffsQuery,
    useGetStaffByIdMutation,
    useUpdateStaffMutation,
    useEnableDisableStaffMutation,
    useDeleteStaffMutation
} = staffAPI;