import { api } from "./api";
import { User, InsertUser } from "@shared/schema";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ success: boolean; data: User[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<{ success: boolean; data: User }, Partial<InsertUser>>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } = userApi;
