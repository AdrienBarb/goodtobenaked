"use client";

import React, { FC } from "react";
import { useParams } from "next/navigation";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import ProfileButton from "@/components/ProfileButton";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import useApi from "@/lib/hooks/useApi";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";
import { useRouter } from "@/navigation";

interface Props {}

const UserProfileMessageButton: FC<Props> = ({}) => {
  //router
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();

  //session
  const { data: session, status } = useSession();

  //traduction
  const t = useTranslations();

  //others
  const redirectToLoginPage = useRedirectToLoginPage();

  const { usePost } = useApi();
  const { mutate: createConversation, isLoading } = usePost(
    "/api/conversations",
    {
      onSuccess: (data) => {
        router.push(`/dashboard/account/messages/${data._id}`);
      },
    }
  );

  const handleWriteMessageClick = () => {
    if (status === "unauthenticated") {
      redirectToLoginPage();
      return;
    }

    createConversation({ userId });
  };

  return (
    <div>
      <ProfileButton
        dataId="profile-message-btn"
        onClick={handleWriteMessageClick}
        isLoading={isLoading}
      >
        {t("profile.popover_write_message")}
      </ProfileButton>
    </div>
  );
};

export default UserProfileMessageButton;
