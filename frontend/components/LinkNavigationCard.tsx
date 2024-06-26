import React, { FC } from "react";
import styles from "@/styles/NavigationCard.module.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";

interface LinkNavigationCardProps {
  text: string;
  path: string;
  withArrow?: boolean;
  isNotification?: boolean;
}

const LinkNavigationCard: FC<LinkNavigationCardProps> = ({
  text,
  path,
  withArrow,
  isNotification,
}) => {
  return (
    <Link href={path} prefetch={true}>
      <div className={styles.container}>
        <div className={styles.text}>{text}</div>
        {isNotification && <span className={styles.notificationBadge}></span>}
        {withArrow && <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />}
      </div>
    </Link>
  );
};

export default LinkNavigationCard;
