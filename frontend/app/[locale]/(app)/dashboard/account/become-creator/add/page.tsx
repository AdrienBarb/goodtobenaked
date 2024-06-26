import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import CreateNude from "@/components/CreateNude";
import PaddingContainer from "@/components/PaddingContainer";
import React from "react";

const AddFirstNudesPage = () => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/become-creator" />
      <PaddingContainer>
        <CreateNude />
      </PaddingContainer>
    </>
  );
};

export default AddFirstNudesPage;
