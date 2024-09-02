import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/Legal.module.scss";
import { useTranslations } from "next-intl";
import { genPageMetadata } from "@/app/seo";

export const metadata = genPageMetadata({
  title: "Conditions d'utilisation",
  description:
    "Consultez les conditions d'utilisation de KYYNK pour comprendre vos droits et responsabilités en tant qu'utilisateur de notre plateforme.",
});

const TermsOfUsePage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>{t("termsOfUse.terms_of_use_main_title")}</h1>
        <p>{t("termsOfUse.terms_of_use_intro_1")}</p>
        <p>{t("termsOfUse.terms_of_use_intro_2")}</p>

        <div className={styles.textContainer}>
          <h2>{t("termsOfUse.terms_of_use_title_1")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_1")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_1")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_2")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_2")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_3")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_3")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_4")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_4")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_5")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_5")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_6")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_6")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_7")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_7")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_8")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_8")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_9")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_9")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_2")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_10")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_10")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_11")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_11")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_12")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_12")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_3")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_13")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_13")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_14")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_14")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_4")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_15")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_15")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_16")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_16")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_17")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_17")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_5")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_18")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_18")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_6")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_20")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_20")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_21")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_21")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_22")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_22")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_7")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_23")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_23")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_25")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_25")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_8")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_27")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_27")}</p>
          <h4>{t("termsOfUse.terms_of_use_subtitle_28")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_28")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_9")}</h2>
          <h4>{t("termsOfUse.terms_of_use_subtitle_29")}</h4>
          <p>{t("termsOfUse.terms_of_use_text_29")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_11")}</h2>
          <p>{t("termsOfUse.terms_of_use_text_31")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_12")}</h2>
          <p>{t("termsOfUse.terms_of_use_text_32")}</p>
          <h2>{t("termsOfUse.terms_of_use_title_13")}</h2>
          <p>{t("termsOfUse.terms_of_use_text_34")}</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default TermsOfUsePage;
