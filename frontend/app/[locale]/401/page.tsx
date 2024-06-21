"use client";

import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "@/navigation";
import styles from "@/styles/errorPage.module.scss";
import { useTranslations } from "next-intl";

const AuthErrorPage = () => {
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    signOut({
      redirect: false,
    });

    router.push("/login");
  }, []);

  return <div className={styles.container}>{t("error.userRedirect")}</div>;
};

export default AuthErrorPage;
