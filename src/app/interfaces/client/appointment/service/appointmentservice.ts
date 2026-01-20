import { api } from "../../../../stores/api";

// ---------------
// TYPES
// ---------------
export interface Appointment {
    id: string;
    client_id: string;
    coach_id: string;
    meeting_type: "single" | "recurring";
    slot: string;
    scheduled_start: string;
    scheduled_end: string;
    duration_minutes: number;
    timezone: string;
    price?: number;
    currency?: string;
    coach_notes?: string;
    client_notes?: string;
    is_overlapped: boolean;

    // --- Optional / Common ---
    date?: string;
    all_day?: boolean;

    // ===== RECURRING ONLY KEYS =====

    repeat_unit?: 1 | 2 | 3 | 4 | 5;
    // 1-Day | 2-Week | 3-Bi_Week | 4-Month | 5-Year

    repeat_interval?: string;
    // Empty for Year

    recurrence_days?: number[];
    // Mandatory for Week/Bi-Week
    // 0-Sun ... 6-Sat
    // SINGLE → []
    // RECURRING → [0–6]

    recurrence_start_date?: string;
    recurrence_end_date?: string;

    // --- Month & Year Only ---
    recurrence_pattern_type?: "fixed" | "relative";

    fixed_day_of_month?: string;
    // Used when pattern_type = fixed

    relative_week_index?: "1" | "2" | "3" | "4" | "5";
    // Used when pattern_type = relative

    relative_day_of_week?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
    coach?: {
        first_name: string;
        last_name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAppointmentInput {
    client_id: string;
    coach_id: string;
    meeting_type: "single" | "recurring";
    slot: string;
    scheduled_start: string;
    scheduled_end: string;
    duration_minutes: number;
    timezone: string;
    price?: number;
    currency?: string;
    coach_notes?: string;
    client_notes?: string;
    is_overlapped: boolean;
    // --- Optional / Common ---
    date?: string;
    all_day?: boolean;

    // ===== RECURRING ONLY KEYS =====

    repeat_unit?: 1 | 2 | 3 | 4 | 5;
    // 1-Day | 2-Week | 3-Bi_Week | 4-Month | 5-Year

    repeat_interval?: string;
    // Empty for Year

    recurrence_days?: number[];
    // Mandatory for Week/Bi-Week
    // 0-Sun ... 6-Sat
    // SINGLE → []
    // RECURRING → [0–6]

    recurrence_start_date?: string;
    recurrence_end_date?: string;

    // --- Month & Year Only ---
    recurrence_pattern_type?: "fixed" | "relative";

    fixed_day_of_month?: string;
    // Used when pattern_type = fixed

    relative_week_index?: "1" | "2" | "3" | "4" | "5";
    // Used when pattern_type = relative

    relative_day_of_week?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

export interface UpdateAppointmentInput {
    appointment_id: string;
    edit_scope: string;
    client_id: string;
    coach_id: string;
    meeting_type: "single" | "recurring";
    slot: string;
    scheduled_start: string;
    scheduled_end: string;
    duration_minutes: number;
    timezone: string;
    price?: number;
    currency?: string;
    coach_notes?: string;
    client_notes?: string;
    is_overlapped: boolean;

    // --- Optional / Common ---
    date?: string;
    all_day?: boolean;

    // ===== RECURRING ONLY KEYS =====

    repeat_unit?: 1 | 2 | 3 | 4 | 5;
    // 1-Day | 2-Week | 3-Bi_Week | 4-Month | 5-Year

    repeat_interval?: string;
    // Empty for Year

    recurrence_days?: number[];
    // Mandatory for Week/Bi-Week
    // 0-Sun ... 6-Sat
    // SINGLE → []
    // RECURRING → [0–6]

    recurrence_start_date?: string;
    recurrence_end_date?: string;

    // --- Month & Year Only ---
    recurrence_pattern_type?: "fixed" | "relative";

    fixed_day_of_month?: string;
    // Used when pattern_type = fixed

    relative_week_index?: "1" | "2" | "3" | "4" | "5";
    // Used when pattern_type = relative

    relative_day_of_week?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

export interface GetAvailableSlotsInput {
    coach_id: string;
    date: string;
}

export interface AvailableSlot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface GetAvailableSlotsResponse {
    date: string;
    day: number;
    bookedSlots: any[];
    availableSlots: AvailableSlot[];
    workingHours: any;
}

// ---------------
// API
// ---------------
export const appointmentService = api.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE
        createAppointment: builder.mutation<Appointment, CreateAppointmentInput>({
            query: (data) => ({
                url: "appointment/create_Appointment_Single",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        // GET BY ID
        getAppointmentById: builder.query<Appointment, string>({
            query: (id) => ({
                url: `appointment/get_appointment_by_id/${id}`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
        }),

        // UPDATE
        updateAppointment: builder.mutation<Appointment, { id: string; data: UpdateAppointmentInput }>({
            query: (data) => ({
                url: `appointment/edit/appointments`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        // CREATE RECURRING
        createRecurringAppointment: builder.mutation<Appointment, CreateAppointmentInput>({
            query: (data) => ({
                url: "appointment/create_Appointment_Multiple",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        // UPDATE RECURRING
        updateRecurringAppointment: builder.mutation<Appointment, { id: string; data: UpdateAppointmentInput }>({
            query: (data) => ({
                url: `appointment/edit/appointments`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        //To get available slots
        getAvailableSlots: builder.mutation<GetAvailableSlotsResponse, GetAvailableSlotsInput>({
            query: (data) => ({
                url: `appointment/available_slots`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        //to cancel the appointment
        cancelAppointment: builder.mutation<Appointment, string>({
            query: (id) => ({
                url: `appointment/cancel_appointment/${id}`,
                method: "PUT",
            }),
            transformResponse: (response: any) => response.data,
        }),

        //to cancel multiple appointments
        cancelMultipleAppointments: builder.mutation<Appointment, string[]>({
            query: (data) => ({
                url: `appointment/cancel_multiple_appointments`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),

        //reschedule the appointment
        rescheduleAppointment: builder.mutation<Appointment, { id: string; data: UpdateAppointmentInput }>({
            query: ({ id, data }) => ({
                url: `appointment/reschedule_appointment/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any) => response.data,
        }),
    }),
});

export const {
    useCreateAppointmentMutation,
    useCreateRecurringAppointmentMutation,
    useGetAppointmentByIdQuery,
    useLazyGetAppointmentByIdQuery,
    useUpdateAppointmentMutation,
    useUpdateRecurringAppointmentMutation,
    useGetAvailableSlotsMutation,
    useCancelAppointmentMutation,
    useCancelMultipleAppointmentsMutation,
    useRescheduleAppointmentMutation,
} = appointmentService;
