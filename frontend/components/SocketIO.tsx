"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useSocket } from "@/lib/hooks/useSocket";
import { useSession } from "next-auth/react";

const SocketIO = () => {
  const { data: session } = useSession();

  useSocket(session?.user?.id);

  return <></>;
};

export default dynamic(() => Promise.resolve(SocketIO), {
  ssr: false,
});
