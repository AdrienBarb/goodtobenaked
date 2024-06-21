import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/AuthPage.module.scss";
import SupportContact from "@/components/SupportContact";
import UserForgotPasswordForm from "@/components/UserForgotPasswordForm";
import { useTranslations } from "next-intl";

const UserForgotPasswordPage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2>{t("common.forgot_password")}</h2>
          <p>{t("common.re_init_password")}</p>
        </div>
        <UserForgotPasswordForm />
      </div>
      <SupportContact />
    </PageContainer>
  );
};

export default UserForgotPasswordPage;
