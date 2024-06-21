"use client";

import DashboardMenu from "@/components/DashboardMenu";
import React, { FC, ReactNode, useEffect, useState } from "react";
import styles from "@/styles/DashboardLayout.module.scss";
import { useSession } from "next-auth/react";
import UserTypeModal from "@/components/UserTypeModal";
import useCheckIfUserVerified from "@/lib/hooks/useCheckIfUserVerified";

interface Props {
  children: ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const checkIfUserVerified = useCheckIfUserVerified();

  useEffect(() => {
    if (session?.user?.id && !session?.user?.userType) {
      setShowUserTypeModal(true);
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
      <UserTypeModal open={showUserTypeModal} setOpen={setShowUserTypeModal} />
    </div>
  );
};

export default DashboardLayout;
