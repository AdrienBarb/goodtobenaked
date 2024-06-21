import React, { FC } from "react";
import EditPasswordForm from "@/components/EditPasswordForm";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface Props {}

const EditPasswordFormPage: FC<Props> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters/my-account" />
      <PaddingContainer>
        <EditPasswordForm />
      </PaddingContainer>
    </>
  );
};

export default EditPasswordFormPage;
