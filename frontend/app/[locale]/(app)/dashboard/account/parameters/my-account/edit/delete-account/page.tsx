import React, { FC } from "react";
import ScrollableContainer from "@/components/ScrollableContainer";
import DeleteAccountForm from "@/components/DeleteAccountForm";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface Props {}

const DeleteAccountPage: FC<Props> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters/my-account" />
      <ScrollableContainer>
        <DeleteAccountForm />
      </ScrollableContainer>
    </>
  );
};

export default DeleteAccountPage;
