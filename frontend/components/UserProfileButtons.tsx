"use client";

import React, { useState, FC } from "react";
import styles from "@/styles/UserProfileButtons.module.scss";
import { useParams } from "next/navigation";
import ProfileButton from "@/components/ProfileButton";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { User } from "@/types/models/User";
import UserProfileNotificationButton from "./UserProfileNotificationButton";
import UserProfileMessageButton from "./UserProfileMessageButton";
import TipsModal from "./TipsModal";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";

interface Props {
  currentUser: User;
  setCurrentUser: (e: User) => void;
}

const UserProfileButtons: FC<Props> = ({ currentUser, setCurrentUser }) => {
  //router
  const { userId } = useParams<{ userId: string }>();

  //session
  const { data: session, status } = useSession();

  //traduction
  const t = useTranslations();

  //others
  const redirectToLoginPage = useRedirectToLoginPage();

  //localstate
  const [openTipsModal, setOpenTipsModal] = useState(false);

  const handleOpenTipsModal = () => {
    if (status === "unauthenticated") {
      redirectToLoginPage();
      return;
    }

    setOpenTipsModal(true);
  };

  return (
    <>
      <div className={styles.buttonsWrapper}>
        {session?.user?.id !== userId && <UserProfileMessageButton />}
        {session?.user?.id !== userId &&
          currentUser?.userType === "creator" && (
            <UserProfileNotificationButton
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}
        {session?.user?.id !== userId && currentUser?.isAccountVerified && (
          <ProfileButton dataId="tips-btn" onClick={handleOpenTipsModal}>
            {t("profile.sendTips")}
          </ProfileButton>
        )}
      </div>

      <TipsModal
        open={openTipsModal}
        setOpen={setOpenTipsModal}
        userId={userId}
      />
    </>
  );
};

export default UserProfileButtons;
