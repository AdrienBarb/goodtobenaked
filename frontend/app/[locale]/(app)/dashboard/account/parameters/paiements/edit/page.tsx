import React, { FC } from "react";
import BankDetailsForm from "@/components/BankDetailsForm";
import PaddingContainer from "@/components/PaddingContainer";

interface EditPayementPageProps {}

const EditPayementPage: FC<EditPayementPageProps> = ({}) => {
  return (
    <PaddingContainer>
      <BankDetailsForm nextPath="/dashboard/account/parameters/paiements" />
    </PaddingContainer>
  );
};

export default EditPayementPage;
