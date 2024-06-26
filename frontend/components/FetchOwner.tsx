"use client";

import { setLoggedUser } from "@/features/user/userSlice";
import useApi from "@/lib/hooks/useApi";
import { useAppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const FetchOwner = () => {
  const { data: session } = useSession();
  const { fetchData } = useApi();
  const dispatch = useAppDispatch();

  const getOwner = async () => {
    try {
      const owner = await fetchData("/api/users/owner");

      dispatch(setLoggedUser(owner));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      getOwner();
    }
  }, [session?.user]);

  return <></>;
};

export default FetchOwner;
