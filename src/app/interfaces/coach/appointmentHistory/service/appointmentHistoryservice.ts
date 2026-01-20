import { api } from "../../../../stores/api";
import type { Appointment } from "../../../client/appointment/service/appointmentservice";

// ---------------
// TYPES
// ---------------
export interface GetAllAppointmentHistoryRequest {
    page: number;
    limit: number;
    end_date?: string;
    start_date?: string;
    clientId?: string;
    coachId?: string;
    search?: string;
    appointment_filter?: string;
}

export interface AppointmentData {
    startDate: string;
    endDate: string;
}

export interface GetAllAppointmentHistoryResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        items: AppointmentData[]; // Preserved user's change
        totalItems: number;
    };
}

// ---------------
// API
// ---------------
export const appointmentHistoryService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAppointmentHistory: builder.query<any, GetAllAppointmentHistoryRequest>({
            query: (data) => ({
                url: "/appointment/get_all_appointments",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: GetAllAppointmentHistoryResponse) => response.data,
        }),

        getAppointmentHistoryById: builder.query<any, string>({
            query: (id) => ({
                url: `/appointment/get_appointment_by_id/${id}`,
                method: "GET",
            }),
            transformResponse: (response: GetAllAppointmentHistoryResponse) => response.data,
        }),

        //cancel appointment
        cancelAppointment: builder.mutation<Appointment, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `appointment/cancel_appointment/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

    }),
});

export const {
    useGetAppointmentHistoryQuery,
    useGetAppointmentHistoryByIdQuery,
    useLazyGetAppointmentHistoryByIdQuery,
    useCancelAppointmentMutation,
} = appointmentHistoryService;
