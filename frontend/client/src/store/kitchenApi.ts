import { api } from "./api";

export interface KitchenOrder {
  id: string;
  eventName: string;
  date: string;
  status: "Confirmed" | "In-Prep" | "Ready";
  dueTime: string;
  menuItems: string[];
  headcount: number;
}

export const kitchenApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getKitchenOrders: builder.query<{ success: boolean; data: KitchenOrder[] }, void>({
      query: () => "/kitchen/orders",
      providesTags: ["Kitchen"],
    }),
    updateOrderStatus: builder.mutation<{ success: boolean; message: string }, { id: string; status: "In-Prep" | "Ready" }>({
      query: ({ id, status }) => ({
        url: `/kitchen/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Kitchen"],
    }),
  }),
});

export const { 
  useGetKitchenOrdersQuery, 
  useUpdateOrderStatusMutation 
} = kitchenApi;
