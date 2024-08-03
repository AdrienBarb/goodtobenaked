"use client";

import { useSession } from "next-auth/react";
import useApi from "./useApi";

const useCheckIfUserVerified = () => {
  const { data: session, update } = useSession();
  const { fetchData } = useApi();

  const checkIfUserVerified = async () => {
    if (
      !session ||
      session?.user?.isAccountVerified ||
      session?.user?.userType === "member"
    ) {
      return;
    }

    try {
      const { isAccountVerified } = await fetchData("/api/users/is-verified");

      if (session) {
        if (session?.user?.isAccountVerified === isAccountVerified) return;

        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            isAccountVerified,
          },
        };

        update(updatedSession);
      }
    } catch (error) {
      console.error("Error checking user verified: ", error);
    }
  };

  return checkIfUserVerified;
};

export default useCheckIfUserVerified;
