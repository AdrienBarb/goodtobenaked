import React from "react";
import { useTranslations } from "next-intl";
import EmailVerification from "@/components/EmailVerification";
import CenterHeader from "@/components/CenterHeader";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

const CreatorEmailConfirmationPage = () => {
  const t = useTranslations();

  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/become-creator" />

      <PaddingContainer>
        <CenterHeader tag="h2" title={t("common.confirmEmail")} />
        <EmailVerification nextPath={"/dashboard/account/become-creator"} />
      </PaddingContainer>
    </>
  );
};

export default CreatorEmailConfirmationPage;
