import { Conversation } from "@/types/models/Conversation";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useHaveBeenBlocked = (conversation: Conversation) => {
  const { data: session } = useSession();

  const haveBeenBlocked = useMemo(() => {
    return Boolean(
      session?.user?.id && conversation.blockedUsers.includes(session?.user?.id)
    );
  }, [conversation, session?.user?.id]);

  return haveBeenBlocked;
};

export default useHaveBeenBlocked;
