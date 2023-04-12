import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: {},
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
