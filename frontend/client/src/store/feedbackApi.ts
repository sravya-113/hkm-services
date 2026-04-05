import { api } from "./api";

export interface FeedbackData {
  _id: string;
  orderId: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  tags: ("Quality" | "Service" | "Punctuality")[];
  createdAt: string;
}

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query<{ success: boolean; data: FeedbackData[] }, void>({
      query: () => "/feedback",
      providesTags: ["Feedback"],
    }),
    addFeedback: builder.mutation<{ success: boolean; data: FeedbackData }, Partial<FeedbackData>>({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"],
    }),
    deleteFeedback: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/feedback/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const { 
  useGetFeedbackQuery, 
  useAddFeedbackMutation, 
  useDeleteFeedbackMutation 
} = feedbackApi;
