"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Nude } from "@/types/models/Nude";

const useCanView = (nude: Nude) => {
  const { data: session } = useSession();

  const canView = useMemo(() => {
    return (
      nude.isFree || (session && nude.paidMembers?.includes(session.user?.id))
    );
  }, [nude.isFree, nude.paidMembers, session?.user?.id]);

  return canView;
};

export default useCanView;
