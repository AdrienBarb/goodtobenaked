import React from "react";
import styles from "../styles/Landing.module.scss";
import LandingButton from "./LandingButton";
import { useTranslations } from "next-intl";

const Landing = () => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 data-id="homepage-title">{t("home.title")}</h1>
        <h2>
          {t("home.subTitle")} <span>{t("home.subTitle1")}</span>
        </h2>
        <div className={styles.buttonWrapper}>
          <LandingButton />
        </div>
      </div>
    </div>
  );
};

export default Landing;
