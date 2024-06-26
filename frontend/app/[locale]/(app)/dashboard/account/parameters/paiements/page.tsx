import React, { FC } from "react";
import PaymentSettings from "@/components/PaymentSettings";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface PaiementsParametersPageProps {}

const PaiementsParametersPage: FC<PaiementsParametersPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters" />
      <PaddingContainer>
        <PaymentSettings />
      </PaddingContainer>
    </>
  );
};

export default PaiementsParametersPage;
