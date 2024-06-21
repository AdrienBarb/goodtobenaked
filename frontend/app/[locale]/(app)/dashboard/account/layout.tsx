import React, { FC, ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "@/navigation";
import FetchOwner from "@/components/FetchOwner";
import { authOptions } from "@/lib/utils/authOptions";

interface Props {
  children: ReactNode;
}

const AccountLayout: FC<Props> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default AccountLayout;
