"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useUserVerified = () => {
  const { data: session } = useSession();

  const isUserVerified = useMemo(() => {
    return session?.user?.isAccountVerified;
  }, [session]);

  return isUserVerified;
};

export default useUserVerified;
