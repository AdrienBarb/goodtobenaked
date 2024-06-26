import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/AuthPage.module.scss";
import UserResetPasswordForm from "@/components/UserResetPasswordForm";
import { useTranslations } from "next-intl";

const UserResetPasswordPage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2>{t("common.forgot_password")}</h2>
          <p>{t("common.write_new_password")}</p>
        </div>
        <UserResetPasswordForm />
      </div>
    </PageContainer>
  );
};

export default UserResetPasswordPage;
