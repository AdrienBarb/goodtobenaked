import React from "react";
import { useTranslations } from "next-intl";
import PageCenterMessage from "@/components/PageCenterMessage";
import { genPageMetadata } from "@/app/seo";
import ReportBugForm from "@/components/TypeForms/ReportBugForm";

export const metadata = genPageMetadata({
  title: "500",
  description:
    "Une erreur interne du serveur s'est produite. Veuillez réessayer ultérieurement ou contacter notre équipe de support.",
});

const ErrorServerPage = () => {
  const t = useTranslations();

  return (
    <PageCenterMessage text={t("error.error_500_text")}>
      <ReportBugForm />
    </PageCenterMessage>
  );
};

export default ErrorServerPage;
