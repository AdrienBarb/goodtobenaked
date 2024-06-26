"use client";

import React, { FC } from "react";
import { useParams } from "next/navigation";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import ProfileButton from "@/components/ProfileButton";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { User } from "@/types/models/User";
import useApi from "@/lib/hooks/useApi";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";

interface Props {
  currentUser: User;
  setCurrentUser: (e: User) => void;
}

const UserProfileNotificationButton: FC<Props> = ({
  currentUser,
  setCurrentUser,
}) => {
  //router
  const { userId } = useParams<{ userId: string }>();

  //session
  const { data: session, status } = useSession();

  //traduction
  const t = useTranslations();

  //others
  const redirectToLoginPage = useRedirectToLoginPage();

  const { usePost } = useApi();
  const { mutate: notificationSubscribe, isLoading } = usePost(
    "/api/users/notification-subscribe",
    {
      onSuccess: (data) => {
        setCurrentUser({
          ...currentUser,
          notificationSubscribers: data,
        });
      },
    }
  );

  const IS_SUBSCRIBE = Boolean(
    session?.user?.id &&
      currentUser.notificationSubscribers.includes(session?.user?.id)
  );

  const handleNotificationSubscribe = () => {
    if (status === "unauthenticated") {
      redirectToLoginPage();
      return;
    }

    notificationSubscribe({
      userId,
    });
  };

  return (
    <div>
      <ProfileButton
        onClick={handleNotificationSubscribe}
        isLoading={isLoading}
        isFull={IS_SUBSCRIBE}
      >
        {IS_SUBSCRIBE
          ? t("profile.popover_desactive_notification")
          : t("profile.popover_active_notification")}
      </ProfileButton>
    </div>
  );
};

export default UserProfileNotificationButton;
