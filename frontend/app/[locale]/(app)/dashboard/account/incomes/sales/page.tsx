import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import PaddingContainer from "@/components/PaddingContainer";
import SalesTable from "@/components/SalesTable";
import React, { FC } from "react";

interface SalesPageProps {}

const SalesPage: FC<SalesPageProps> = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/incomes" />
      <PaddingContainer>
        <SalesTable />
      </PaddingContainer>
    </>
  );
};

export default SalesPage;
