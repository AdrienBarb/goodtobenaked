import React from "react";
import { useTranslations } from "next-intl";
import EmailVerification from "@/components/EmailVerification";
import CenterHeader from "@/components/CenterHeader";
import PaddingContainer from "@/components/PaddingContainer";

const CreatorEmailConfirmationPage = () => {
  const t = useTranslations();

  return (
    <PaddingContainer>
      <CenterHeader tag="h2" title={t("common.confirmEmail")} />
      <EmailVerification
        nextPath={"/dashboard/account/parameters/my-account"}
      />
    </PaddingContainer>
  );
};

export default CreatorEmailConfirmationPage;
