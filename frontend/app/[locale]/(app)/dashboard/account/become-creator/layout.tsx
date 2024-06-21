import SmallLayoutContainer from "@/components/SmallLayoutContainer";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const BecomeCreatorLayout: FC<Props> = ({ children }) => {
  return <SmallLayoutContainer>{children}</SmallLayoutContainer>;
};

export default BecomeCreatorLayout;
