import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import conversationService from "./conversationService";

type ReduxState = {
  isUnreadMessages: boolean;
};

const initialState: ReduxState = {
  isUnreadMessages: false,
};

export const checkIfUnreadMessages = createAsyncThunk(
  "conversation/checkIfUnreadMessages",
  async (_, thunkAPI) => {
    try {
      return await conversationService.checkIfUnreadMessages();
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const conversationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadMessages: (state, action) => {
      state.isUnreadMessages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkIfUnreadMessages.fulfilled, (state, action) => {
      state.isUnreadMessages = action.payload;
    });
  },
});

export const { setUnreadMessages } = conversationSlice.actions;
export default conversationSlice.reducer;
