"use client";

import React, { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface CustomSessionProviderProps {
  children: ReactNode;
}

const CustomSessionProvider: FC<CustomSessionProviderProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default CustomSessionProvider;
