import NavigationBar from "@/components/Common/NavigationBar";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AppLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
