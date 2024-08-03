"use client";

import React, { FC } from "react";
import styles from "@/styles/UserUncompletedProfileBand.module.scss";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface UserUncompletedProfileBandProps {}

const UserUncompletedProfileBand: FC<
  UserUncompletedProfileBandProps
> = ({}) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const { userId } = useParams<{ userId: string }>();

  if (
    session &&
    session?.user?.id === userId &&
    session?.user?.userType === "creator" &&
    !session?.user?.isAccountVerified
  ) {
    return (
      <div className={styles.container}>
        {t("common.youHaveToCompleteYourProfile")}
        <Link href={`/dashboard/account/become-creator`} prefetch>
          {t("common.completeYourProfile")}
        </Link>
      </div>
    );
  }

  return <></>;
};

export default UserUncompletedProfileBand;
