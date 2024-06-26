import React, { FC } from "react";
import styles from "@/styles/NotificationCard.module.scss";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from "@mui/icons-material/Drafts";
import { Link } from "@/navigation";
import TimeAgo from "javascript-time-ago";
import fr from "javascript-time-ago/locale/fr";
import moment from "moment";
import clsx from "clsx";
import { Notification } from "@/types/models/NotificationModel";
import Text from "./Text";
import { useTranslations } from "next-intl";

//Config timeago in french
TimeAgo.addDefaultLocale(fr);

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: FC<NotificationCardProps> = ({ notification }) => {
  const t = useTranslations();

  //others
  const timeAgo = new TimeAgo("fr-FR");

  const dateObject = moment(notification.createdAt).toDate();
  const timeAgoValue = timeAgo.format(dateObject);

  let notificationText = null;
  switch (notification.type) {
    case "profile_viewed":
      notificationText = (
        <Text customStyles={{ color: "white" }}>
          <Link href={`/dashboard/community/${notification.fromUser._id}`}>
            {notification.fromUser.pseudo}
          </Link>{" "}
          {t("notification.sawYourProfil")}
        </Text>
      );
      break;

    default:
      break;
  }

  return (
    <div
      className={clsx(
        styles.container,
        !notification.read && styles.unreadStyles
      )}
    >
      <div className={styles.details}>
        <div>{notificationText}</div>
        <div className={styles.time}>{timeAgoValue}</div>
      </div>
      <div>
        {notification.read ? (
          <DraftsIcon fontSize="small" sx={{ color: "white" }} />
        ) : (
          <MailIcon fontSize="small" sx={{ color: "white" }} />
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
