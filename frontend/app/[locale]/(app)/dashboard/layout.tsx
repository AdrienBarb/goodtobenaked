"use client";

import DashboardMenu from "@/components/DashboardMenu";
import React, { FC, ReactNode, useEffect, useState } from "react";
import styles from "@/styles/DashboardLayout.module.scss";
import { useSession } from "next-auth/react";
import useCheckIfUserVerified from "@/lib/hooks/useCheckIfUserVerified";
import { useRouter } from "@/navigation";

interface Props {
  children: ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const checkIfUserVerified = useCheckIfUserVerified();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id && !session?.user?.userType) {
      router.push("/register/user-type");
    }
  }, [session?.user?.id]);

  useEffect(() => {
    checkIfUserVerified();
  }, [session]);

  return (
    <div className={styles.container}>
      {session?.user?.id && <DashboardMenu />}
      <div
        className={styles.content}
        style={{ ...(!session?.user?.id && { marginLeft: "0" }) }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
