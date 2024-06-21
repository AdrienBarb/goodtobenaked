import Footer from "@/components/Footer";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
