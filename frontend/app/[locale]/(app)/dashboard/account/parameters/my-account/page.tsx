import React, { FC } from "react";
import UserSettings from "@/components/UserSettings";
import PaddingContainer from "@/components/PaddingContainer";
import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";

interface AccountParametersPageProps {}

const AccountParametersPage: FC<AccountParametersPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/parameters" />
      <PaddingContainer>
        <UserSettings />
      </PaddingContainer>
    </>
  );
};

export default AccountParametersPage;
