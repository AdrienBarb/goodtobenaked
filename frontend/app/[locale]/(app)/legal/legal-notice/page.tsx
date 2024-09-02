import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/Legal.module.scss";
import { useTranslations } from "next-intl";
import { genPageMetadata } from "@/app/seo";

export const metadata = genPageMetadata({
  title: "Mentions légales",
  description:
    "Consultez les mentions légales de KYYNK pour en savoir plus sur notre entreprise, nos conditions d'utilisation, notre politique de confidentialité et d'autres informations importantes.",
});

const LegalNoticePage = () => {
  const t = useTranslations();

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>{t("legal-notice.legal_notice_main_title")}</h1>
        <p>{t("legal-notice.legal_notice_intro_1")}</p>
        <p>{t("legal-notice.legal_notice_intro_2")}</p>
        <p>{t("legal-notice.legal_notice_intro_3")}</p>
      </div>
    </PageContainer>
  );
};

export default LegalNoticePage;
