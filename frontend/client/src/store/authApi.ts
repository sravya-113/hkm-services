import { api } from "./api";
import { setCredentials } from "./authSlice";

const normalizeLoginPayload = (credentials: any) => ({
  email: credentials?.email ?? credentials?.username ?? "",
  password: credentials?.password ?? "",
});

const extractAuthPayload = (data: any) => ({
  token: data?.token,
  user: data?.user,
});

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: normalizeLoginPayload(credentials),
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(extractAuthPayload(data)));
        } catch (err: any) {
          console.error("Login mutation failed:", err.data?.message || err.message || err);
        }
      },
    }),
    status: builder.query({
      query: () => "/auth/me",
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useStatusQuery, useLogoutMutation } = authApi;

