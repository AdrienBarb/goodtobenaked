"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/UserIncomesSummary.module.scss";
import HeaderSection from "./HeaderSection";
import SimpleButton from "./Buttons/SimpleButton";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import { User } from "@/types/models/User";
import toast from "react-hot-toast";
import Text from "./Text";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "@/navigation";
import SuccessModal from "./SucessModal";

const UserIncomesSummary = () => {
  //localstate
  const [balances, setBalances] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const router = useRouter();

  const t = useTranslations();

  const { fetchData, usePost } = useApi();

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setCurrentUser(r);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalances = async () => {
    try {
      const { balances } = await fetchData(`/api/incomes/balances`);

      setBalances(balances);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
    getBalances();
  }, []);

  const { mutate: createInvoice, isLoading } = usePost(
    `/api/incomes/create-invoice`,
    {
      onSuccess: () => {
        setOpenSuccessModal(true);
        setBalances(0);
      },
    }
  );

  const handleBankTransfer = () => {
    if (!currentUser?.bankAccount?.name || !currentUser?.bankAccount?.iban) {
      setOpenAlertModal(true);
      return;
    }

    if (balances <= 0) {
      toast.error(t("error.current_wallet_empty"));
      return;
    }

    createInvoice({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <HeaderSection title={t("incomes.balanceInEuro")}>
          <SimpleButton
            onClick={handleBankTransfer}
            isLoading={isLoading}
            disabled={balances <= 0}
          >
            {t("incomes.transfer_action")}
          </SimpleButton>
        </HeaderSection>
        <div className={styles.line}>
          <Text>{t("incomes.yourBalanceIs")}</Text>
          <Text weight="bolder">{`${balances / 100} €`}</Text>
        </div>
      </div>
      <SuccessModal
        open={openSuccessModal}
        setOpen={setOpenSuccessModal}
        title={t("incomes.success_income_title")}
        text={t("incomes.success_income")}
      />
      <ConfirmationModal
        open={openAlertModal}
        setOpen={setOpenAlertModal}
        confirmAction={() =>
          router.push("/dashboard/account/parameters/paiements")
        }
        title={t("incomes.alert_bank_details_title")}
        text={t("incomes.alert_bank_details_text")}
        buttonText={t("incomes.imGoing")}
      />
    </div>
  );
};

export default UserIncomesSummary;
