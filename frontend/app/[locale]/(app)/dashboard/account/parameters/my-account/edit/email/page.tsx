import React, { FC } from "react";
import EditEmailForm from "@/components/EditEmailForm";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface EditEmailPageProps {}

const EditEmailPage: FC<EditEmailPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters/my-account" />

      <PaddingContainer>
        <EditEmailForm />
      </PaddingContainer>
    </>
  );
};

export default EditEmailPage;
