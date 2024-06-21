import LoginNavigationBar from "@/components/LoginNavigationBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout: FC<Props> = async ({ children }) => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <>
      <header>
        <LoginNavigationBar />
      </header>
      <main>{children}</main>
    </>
  );
};

export default AuthLayout;
