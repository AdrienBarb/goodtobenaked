import ContainerWithBackArrow from "@/components/ContainerWithBackArrow";
import InvoiceTable from "@/components/InvoiceTable";
import PaddingContainer from "@/components/PaddingContainer";
import React from "react";

const InvoicesPage = ({}) => {
  return (
    <>
      <ContainerWithBackArrow prevPath="/dashboard/account/incomes" />
      <PaddingContainer>
        <InvoiceTable />
      </PaddingContainer>
    </>
  );
};

export default InvoicesPage;
