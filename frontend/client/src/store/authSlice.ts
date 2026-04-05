import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer' | 'staff';
  isActive?: boolean;
}


interface AuthState {
  token: string | null;
  user: User | null;
}

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, logOut, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;