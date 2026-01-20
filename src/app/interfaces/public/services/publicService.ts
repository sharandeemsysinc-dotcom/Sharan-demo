import { api } from "../../../../app/stores/api";

export const activityLogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivityLogs: builder.query({
      query: (userdata) => ({
        url: "api/blog/getAllBlogs",
        method: "POST",
        body: userdata,
      }),
      providesTags: ["Employee"], // optional caching tag
    }),
  }),
});

export const { useGetAllActivityLogsQuery } = activityLogApi;
