import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useIsOwner = (userId: String) => {
  const { data: session } = useSession();

  const isOwner = useMemo(() => {
    return userId === session?.user?.id;
  }, [userId, session?.user?.id]);

  return isOwner;
};

export default useIsOwner;
