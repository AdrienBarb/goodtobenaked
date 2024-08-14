import React, { FC, ReactNode } from "react";
import styles from "@/styles/ProfileLayout.module.scss";
import ScrollableContainer from "@/components/ScrollableContainer";
import { getServerSession } from "next-auth";
import userService from "@/features/user/userService";
import BackButton from "@/components/Common/BackButton";
import UserProfileHeader from "@/components/UserProfileHeader";
import { authOptions } from "@/lib/utils/authOptions";
import UserUncompletedProfileBand from "@/components/UserUncompletedProfileBand";
import ErrorMessage from "@/components/ErrorMessage";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import IconButton from "@/components/Buttons/IconButton";
import UserProfileTopButtons from "@/components/UserProfileTopButtons";
import UserSecondaryProfileImageGallery from "@/components/UserSecondaryProfileImagesGallery";

const ProfileLayout = async ({
  params,
  children,
}: {
  params: { userId: string; locale: string };
  children: ReactNode;
}) => {
  const { userId, locale } = params;
  const session = await getServerSession(authOptions);

  const t = await getTranslations({ locale });

  if (userId === "index.js.map") {
    return;
  }

  const initialUserDatas = await userService.getUser(userId);

  try {
    if (session?.user?.id !== userId) {
      await userService.profileVisit({ userId });
    }
  } catch (error) {
    console.log(error);
  }

  if (initialUserDatas.isArchived) {
    return <ErrorMessage message={t("error.userArchived")} />;
  }

  return (
    <ScrollableContainer>
      {session && (
        <BackButton prevPath="/dashboard/community">
          <UserProfileTopButtons />
        </BackButton>
      )}
      <UserUncompletedProfileBand />
      <UserProfileHeader initialUserDatas={initialUserDatas} />
      {initialUserDatas.secondaryProfileImages &&
        initialUserDatas.secondaryProfileImages.length > 0 && (
          <UserSecondaryProfileImageGallery
            images={initialUserDatas.secondaryProfileImages}
          />
        )}
      {(initialUserDatas?.isAccountVerified ||
        session?.user?.id === userId) && (
        <div className={styles.contentContainer}>{children}</div>
      )}
    </ScrollableContainer>
  );
};

export default ProfileLayout;
