import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/models/User";

const useConversationUsers = (participants: User[]) => {
  const { data: session } = useSession();

  const [otherUser, setOtherUser] = useState<User | null | undefined>(null);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const localOtherUser = participants.find(
      (p: User) => p._id !== session?.user?.id
    );
    const localCurrentUser = participants.find(
      (p: User) => p._id === session?.user?.id
    );

    setOtherUser(localOtherUser);
    setCurrentUser(localCurrentUser);
  }, [participants, session?.user?.id]);

  return { currentUser, otherUser };
};

export default useConversationUsers;
