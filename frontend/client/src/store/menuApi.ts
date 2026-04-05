import { api } from "./api";
import { MenuItem } from "@shared/schema";

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query<MenuItem[], string | void>({
      query: (category) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append("category", category);
        return `/menu?${params.toString()}`;
      },
      transformResponse: (response: { success: boolean; data: any[] }) => {
        return response.data.map(item => ({
          ...item,
          id: item.id || item._id
        })) as MenuItem[];
      },
      providesTags: ["Menu"],
    }),
    createMenuItem: builder.mutation<MenuItem, Partial<MenuItem>>({
      query: (newItem) => ({
        url: "/menu",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Menu"],
    }),
    updateMenuItem: builder.mutation<MenuItem, { id: string; data: Partial<MenuItem> }>({
      query: ({ id, data }) => ({
        url: `/menu/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Menu"],
    }),
    deleteMenuItem: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/menu/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const {
  useGetMenuQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;