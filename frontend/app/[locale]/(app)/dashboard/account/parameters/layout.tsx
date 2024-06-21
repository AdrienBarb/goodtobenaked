"use client";

import React, { FC, ReactNode } from "react";
import SmallLayoutContainer from "@/components/SmallLayoutContainer";

interface ParametersLayoutProps {
  children: ReactNode;
}

const ParametersLayout: FC<ParametersLayoutProps> = ({ children }) => {
  return <SmallLayoutContainer>{children}</SmallLayoutContainer>;
};

export default ParametersLayout;
