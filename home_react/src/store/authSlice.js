import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth, login as apiLogin, logout as apiLogout } from "../helpers/auth-api";

export const loginThunk = createAsyncThunk("auth/login", async ({ login, password }) => {
  const payload = await apiLogin(login, password);
  return payload;  
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getAuth(),  
    isLoading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      apiLogout();
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
    hydrateFromStorage(state) {
      state.user = getAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? "Login failed";
      });
  },
});

export const { logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;