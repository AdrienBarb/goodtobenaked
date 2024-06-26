import React from "react";
import PageCenterMessage from "@/components/PageCenterMessage";
import { useTranslations } from "next-intl";
import ReportBugForm from "@/components/TypeForms/ReportBugForm";
import { genPageMetadata } from "@/app/seo";

export const metadata = genPageMetadata({
  title: "404",
  description:
    "La page que vous cherchez n'a pas été trouvée. Veuillez vérifier l'URL ou retourner à la page d'accueil.",
});

const ErrorNotFoundPage = () => {
  const t = useTranslations();

  return (
    <PageCenterMessage text={t("error.error_404_text")}>
      <ReportBugForm />
    </PageCenterMessage>
  );
};

export default ErrorNotFoundPage;
