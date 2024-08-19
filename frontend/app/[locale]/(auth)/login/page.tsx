import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/AuthPage.module.scss";
import EmptyButton from "@/components/Buttons/EmptyButton";
import UserSignInForm from "@/components/UserSignInForm";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

const LoginPage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 data-id="sign-in-title">{t("common.signIn")}</h2>
        </div>
        <UserSignInForm />
        <div className={styles.buttonsWrapper}>
          <EmptyButton customStyles={{ width: "100%" }} href="/register">
            {t("common.signUp")}
          </EmptyButton>
          <Link href="/login/forgot-password">
            {t("common.forgotPassword")}
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;
