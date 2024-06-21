import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootStateType } from "@/store/store";

const useIsUserOnline = (userId: string | undefined) => {
  const state = useSelector((state: RootStateType) => state.socket);

  const isOnline = useMemo(() => {
    return state.onlineUsers?.some((user) => user.userId === userId);
  }, [state.onlineUsers, userId]);

  return isOnline;
};

export default useIsUserOnline;
