import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setOnlineUsers } from "@/features/socketIO/socketIOSlice";
import socket from "../socket/socket";

export const useSocket = (userId: string | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    if (userId) {
      socket?.emit("addUser", userId);
    }

    socket?.on("getUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket?.off("getUsers");
    };
  }, [dispatch, userId]);
};
