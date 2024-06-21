"use client";

import React, { FC } from "react";
import styles from "@/styles/NavigationCard.module.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";

import clsx from "clsx";

interface NavigationCardProps {
  label: string;
  onClick?: () => void;
  href?: string;
  withArrow?: boolean;
  isNotification?: boolean;
}

const NavigationCard: FC<NavigationCardProps> = ({
  label,
  onClick,
  href,
  withArrow,
  isNotification,
}) => {
  const t = useTranslations();
  const path = usePathname();

  const isLinkSelected = (linkPath: string) => path === linkPath;

  if (href) {
    return (
      <Link href={href} prefetch>
        <div
          className={clsx(
            styles.container,
            isLinkSelected(href) && styles.isSelected
          )}
        >
          <div>{t(`navigation.${label}`)}</div>
          {isNotification && <span className={styles.notificationBadge}></span>}
          {withArrow && <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />}
        </div>
      </Link>
    );
  }

  return (
    <div className={clsx(styles.container)} onClick={onClick}>
      <div>{t(`navigation.${label}`)}</div>
      {isNotification && <span className={styles.notificationBadge}></span>}
      {withArrow && <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />}
    </div>
  );
};

export default NavigationCard;
