import { api } from "./api";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  orderNumber: string;
  eventName: string;
  customerName: string;
  customerPhone: string;
  pax: number;
  department: string;
  venue: string;
  status: string;
  kitchenStatus: string;
  paymentStatus: string;
  amountDue: number;
}

export interface CalendarEventsResponse {
  success: boolean;
  count: number;
  view: string;
  data: CalendarEvent[];
}

export interface CalendarEventsParams {
  from?: string;
  to?: string;
  status?: string;
  department?: string;
}

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query<CalendarEventsResponse, CalendarEventsParams | void>({
      query: (params) => ({
        url: "/calendar/events",
        params: params || {},
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetCalendarEventsQuery } = calendarApi;
