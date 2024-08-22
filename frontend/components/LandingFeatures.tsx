import React from "react";
import styles from "@/styles/LastArticleHomeSection.module.scss";
import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";
import LandingHeader from "./LandingHeader";

const LandingFeatures = () => {
  const t = useTranslations();

  return (
    <section className={styles.container}>
      <LandingHeader title={t("home.earnWhile")} />
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
        <FeatureCard
          icon="💸"
          title={t("home.payToView")}
          description={t("home.payToViewText")}
        />
        <FeatureCard
          icon="💬"
          title={t("home.messaging")}
          description={t("home.messagingText")}
        />
        <FeatureCard
          icon="💰"
          title={t("home.tips")}
          description={t("home.tipsText")}
        />
      </div>
    </section>
  );
};

export default LandingFeatures;
