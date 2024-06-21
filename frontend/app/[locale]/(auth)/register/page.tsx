import React from "react";
import PageContainer from "@/components/PageContainer";
import UserSignUpForm from "@/components/UserSignUpForm";
import styles from "@/styles/AuthPage.module.scss";
import EmptyButton from "@/components/Buttons/EmptyButton";
import { useTranslations } from "next-intl";

const SignUpPage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2>{t("common.signUp")}</h2>
        </div>
        <UserSignUpForm />
        <div className={styles.buttonsWrapper}>
          <EmptyButton customStyles={{ width: "100%" }} href="/login">
            {t("common.signIn")}
          </EmptyButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default SignUpPage;
