"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/AccountVerification.module.scss";
import { useTranslations } from "next-intl";
import VerificationCard from "./VerificationCard";
import useApi from "@/lib/hooks/useApi";

const AccountVerification = () => {
  const t = useTranslations();
  const { fetchData } = useApi();

  const [userVerification, setUserVerification] = useState({
    isIdentityVerified: false,
    isEmailVerified: false,
    isProfileCompleted: false,
    isBankAccountCompleted: false,
    isNudesPosted: false,
  });

  const checkUser = async () => {
    const r = await fetchData("/api/users/verification-step");

    setUserVerification({
      ...userVerification,
      isIdentityVerified: r.isIdentityVerified,
      isEmailVerified: r.isEmailVerified,
      isProfileCompleted: r.isProfileCompleted,
      isBankAccountCompleted: r.isBankAccountCompleted,
      isNudesPosted: r.isNudesPosted,
    });
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className={styles.container}>
      <VerificationCard
        isValid={userVerification.isProfileCompleted}
        path={"/dashboard/account/become-creator/profile"}
        label={t("common.completeMyProfile")}
      />
      <VerificationCard
        isValid={userVerification.isBankAccountCompleted}
        path={"/dashboard/account/become-creator/paiements"}
        label={t("common.banksInfos")}
      />
      <VerificationCard
        isValid={userVerification.isEmailVerified}
        path={"/dashboard/account/become-creator/email"}
        label={t("common.confirmEmail")}
      />
      <VerificationCard
        isValid={userVerification.isIdentityVerified}
        path={"/dashboard/account/become-creator/identity"}
        label={t("common.identityVerification")}
      />
      <VerificationCard
        isValid={userVerification.isNudesPosted}
        path={"/dashboard/account/become-creator/add"}
        label={t("common.post3Nudes")}
      />
    </div>
  );
};

export default AccountVerification;
