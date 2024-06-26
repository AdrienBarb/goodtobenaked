import React, { FC, ReactNode } from "react";
import SmallLayoutContainer from "@/components/SmallLayoutContainer";

interface IncomesLayoutProps {
  children: ReactNode;
}

const IncomesLayout: FC<IncomesLayoutProps> = ({ children }) => {
  return <SmallLayoutContainer>{children}</SmallLayoutContainer>;
};

export default IncomesLayout;
