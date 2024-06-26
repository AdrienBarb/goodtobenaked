import React from "react";
import IdentityVerificationForm from "@/components/IdentityVerificationForm";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

const creatorProfilVerificationPage = () => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/become-creator" />

      <PaddingContainer>
        <IdentityVerificationForm />
      </PaddingContainer>
    </>
  );
};

export default creatorProfilVerificationPage;
