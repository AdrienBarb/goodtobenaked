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
import SimplePopover from "./SimplePopover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const UserIncomesSummary = () => {
  //localstate
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
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
      const { available, pending } = await fetchData(`/api/incomes/balances`);

      setAvailableBalance(available);
      setPendingBalance(pending);
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
        setAvailableBalance(0);
        setPendingBalance(0);
      },
    }
  );

  const handleBankTransfer = () => {
    if (!currentUser?.bankAccount?.name || !currentUser?.bankAccount?.iban) {
      setOpenAlertModal(true);
      return;
    }

    if (availableBalance < 5000) {
      toast.error(t("error.current_wallet_empty"));
      return;
    }

    createInvoice({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.cardWrapper}>
          <div className={styles.balanceCard}>
            <div className={styles.popoverWrapper}>
              <SimplePopover
                description={t("incomes.availablePopoverDescription")}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  color="#d9d7f6"
                  size="lg"
                />
              </SimplePopover>
            </div>
            <Text>{t("incomes.available")}</Text>
            <Text weight="bolder" fontSize={22}>{`${
              availableBalance / 100
            } €`}</Text>
          </div>
          <div className={styles.balanceCard}>
            <div className={styles.popoverWrapper}>
              <SimplePopover
                description={t("incomes.pendingPopoverDescription")}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  color="#d9d7f6"
                  size="lg"
                />
              </SimplePopover>
            </div>
            <Text>{t("incomes.pending")}</Text>
            <Text weight="bolder" fontSize={22}>{`${
              pendingBalance / 100
            } €`}</Text>
          </div>
        </div>

        <SimpleButton
          onClick={handleBankTransfer}
          isLoading={isLoading}
          disabled={availableBalance < 5000}
          customStyles={{
            width: "100%",
            marginTop: "1rem",
          }}
        >
          {t("incomes.transfer_action")}
        </SimpleButton>
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
