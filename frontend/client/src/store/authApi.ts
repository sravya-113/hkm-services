import { api } from "./api";
import { setCredentials } from "./authSlice";

const normalizeLoginPayload = (credentials: any) => ({
  email: credentials?.email ?? credentials?.username ?? "",
  password: credentials?.password ?? "",
});

const normalizeSignupPayload = (userData: any) => ({
  name: userData?.name,
  email: userData?.email ?? userData?.username ?? "",
  password: userData?.password,
  role: userData?.role,
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
        } catch (err) {
          console.error("Login mutation failed:", err);
        }
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: normalizeSignupPayload(userData),
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(extractAuthPayload(data)));
        } catch (err) {
          console.error("Signup mutation failed:", err);
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

export const { useLoginMutation, useSignupMutation, useStatusQuery, useLogoutMutation } = authApi;

