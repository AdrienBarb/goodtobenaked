import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

let socket = null
if (typeof window !== "undefined") {
  socket = io(process.env.NEXT_PUBLIC_API_URL)
}

const initialState = {
  socket: socket ? socket : null,
  onlineUsers: []
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

export const { setOnlineUsers } = socketIOSlice.actions
export default socketIOSlice.reducer;
