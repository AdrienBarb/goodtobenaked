import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import notificationService from "./notificationService";

type NotificationReduxState = {
  unreadNotifications: boolean;
};

const initialState: NotificationReduxState = {
  unreadNotifications: false,
};

export const getUnreadNotificationsCount = createAsyncThunk(
  "notification/getUnreadNotificationsCount",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUnreadNotificationsCount();
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUnreadNotificationsCount.fulfilled, (state, action) => {
      state.unreadNotifications = action.payload;
    });
  },
});

export const { setUnreadNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
