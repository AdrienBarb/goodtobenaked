import React from "react";
import styles from "../styles/Landing.module.scss";
import LandingButton from "./LandingButton";
import { useTranslations } from "next-intl";

const Landing = () => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>{t("home.title")}</h1>
        <h2>{t("home.subTitle")}</h2>
        <h2>{t("home.subTitle1")}</h2>
        <div className={styles.buttonWrapper}>
          <LandingButton />
        </div>
      </div>
    </div>
  );
};

export default Landing;
