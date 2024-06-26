import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import forgotPasswordService from "./forgotPasswordService";

type ForgotPasswordState = {
  isPasswordResetError: boolean;
  isPasswordResetSuccess: boolean;
  isPasswordResetLoading: boolean;
  isPasswordRequestError: boolean;
  isPasswordRequestSuccess: boolean;
  isPasswordRequestLoading: boolean;
};

const initialState: ForgotPasswordState = {
  isPasswordResetError: false,
  isPasswordResetSuccess: false,
  isPasswordResetLoading: false,
  isPasswordRequestError: false,
  isPasswordRequestSuccess: false,
  isPasswordRequestLoading: false,
};

export const resetPasswordRequest = createAsyncThunk(
  "forgotPassword/resetPasswordRequest",
  async (values: { email: string; locale: string }, thunkAPI) => {
    try {
      return await forgotPasswordService.resetPasswordRequest(values);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async (
    values: { password: string; userId: string; token: string },
    thunkAPI
  ) => {
    try {
      return await forgotPasswordService.resetPassword(values);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    resetForgotPassword: (state) => {
      state.isPasswordResetError = false;
      state.isPasswordResetSuccess = false;
      state.isPasswordResetLoading = false;
      state.isPasswordRequestError = false;
      state.isPasswordRequestSuccess = false;
      state.isPasswordRequestLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordRequest.pending, (state) => {
        state.isPasswordRequestLoading = true;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.isPasswordRequestLoading = false;
        state.isPasswordRequestSuccess = true;
      })
      .addCase(resetPasswordRequest.rejected, (state) => {
        state.isPasswordRequestLoading = false;
        state.isPasswordRequestError = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isPasswordResetLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isPasswordResetLoading = false;
        state.isPasswordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isPasswordResetLoading = false;
        state.isPasswordResetError = true;
      });
  },
});

export const { resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
