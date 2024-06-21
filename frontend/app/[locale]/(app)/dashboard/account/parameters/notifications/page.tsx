import React, { FC } from "react";
import NotificationSettings from "@/components/NotificationSettings";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface NotificationPageProps {}

const NotificationPage: FC<NotificationPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters" />
      <PaddingContainer>
        <NotificationSettings />
      </PaddingContainer>
    </>
  );
};

export default NotificationPage;
