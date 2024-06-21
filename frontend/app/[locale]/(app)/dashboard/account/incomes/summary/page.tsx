import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import PaddingContainer from "@/components/PaddingContainer";
import UserIncomesSummary from "@/components/UserIncomesSummary";
import React, { FC } from "react";

interface IncomesPageProps {}

const IncomesPage: FC<IncomesPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/incomes" />
      <PaddingContainer>
        <UserIncomesSummary />
      </PaddingContainer>
    </>
  );
};

export default IncomesPage;
