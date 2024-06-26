import { SocketUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type SocketReduxState = {
  onlineUsers: SocketUser[];
};

const initialState: SocketReduxState = {
  onlineUsers: [],
};

export const socketIOSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = [...action.payload];
    },
  },
});

export const { setOnlineUsers } = socketIOSlice.actions;
export default socketIOSlice.reducer;
