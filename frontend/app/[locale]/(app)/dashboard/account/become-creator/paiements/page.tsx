import React, { FC } from "react";
import PaymentSettings from "@/components/PaymentSettings";
import PaddingContainer from "@/components/PaddingContainer";
import BankDetailsForm from "@/components/BankDetailsForm";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface PaiementsParametersPageProps {}

const PaiementsParametersPage: FC<PaiementsParametersPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/become-creator" />

      <PaddingContainer>
        <BankDetailsForm nextPath="/dashboard/account/become-creator" />
      </PaddingContainer>
    </>
  );
};

export default PaiementsParametersPage;
