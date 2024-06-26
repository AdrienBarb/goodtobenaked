"use client";

import React, { FC } from "react";
import styles from "@/styles/UserUncompletedProfileBand.module.scss";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

interface UserUncompletedProfileBandProps {}

const UserUncompletedProfileBand: FC<
  UserUncompletedProfileBandProps
> = ({}) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      {t("common.youHaveToCompleteYourProfile")}
      <Link href={`/dashboard/account/become-creator`} prefetch>
        {t("common.completeYourProfile")}
      </Link>
    </div>
  );
};

export default UserUncompletedProfileBand;
