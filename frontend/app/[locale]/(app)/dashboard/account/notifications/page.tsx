import React, { FC } from "react";
import notificationService from "@/features/notification/notificationService";
import ScrollableContainer from "@/components/ScrollableContainer";
import NotificationsList from "@/components/NotificationsList";

interface NotificationPageProps {}

const NotificationPage: FC<NotificationPageProps> = async ({}) => {
  const initialNotificationsData = await notificationService.getNotifications();

  return (
    <ScrollableContainer>
      <NotificationsList initialNotificationsData={initialNotificationsData} />
    </ScrollableContainer>
  );
};

export default NotificationPage;
