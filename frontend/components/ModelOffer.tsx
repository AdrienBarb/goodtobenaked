import React from "react";
import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";
import LandingHeader from "./LandingHeader";
import FullButton from "./Buttons/FullButton";

const ModelOffer = () => {
  const t = useTranslations();

  return (
    <section className="max-w-4xl mx-auto py-20 px-4 flex flex-col items-center">
      <LandingHeader
        title={t("home.youreModel")}
        description={t("home.modelOffer")}
      />
      <FullButton href="/register">{t("common.signUp")}</FullButton>
    </section>
  );
};

export default ModelOffer;
