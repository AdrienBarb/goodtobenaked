import React, { useEffect, useState } from "react";
import styles from "@/styles/CreditAmount.module.scss";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import ConfirmationModal from "./ConfirmationModal";
import useNavigateToPayment from "@/lib/hooks/useNavigateToPayment";
import { RootStateType, useAppDispatch } from "@/store/store";
import { getCreditAmount } from "@/features/user/userSlice";
import { useSelector } from "react-redux";

const CreditAmount = () => {
  const [openCreditResumeModal, setOpenCreditResumeModal] = useState(false);
  const { data: session, status } = useSession();
  const t = useTranslations();
  const navigateToPayment = useNavigateToPayment();
  const dispatch = useAppDispatch();
  const userState = useSelector((state: RootStateType) => state.user);

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(getCreditAmount());
    }
  }, [session?.user?.id]);

  if (status === "unauthenticated") {
    return <></>;
  }

  return (
    <>
      <div
        className={styles.creditAmount}
        onClick={() => setOpenCreditResumeModal(true)}
      >
        {t("common.numberOfCredit", {
          creditCount: userState.creditAmount / 100,
        })}
      </div>

      <ConfirmationModal
        open={openCreditResumeModal}
        setOpen={setOpenCreditResumeModal}
        confirmAction={navigateToPayment}
        title={t("common.yourCredit")}
        text={t("common.youHaveNumberOfCredit", {
          creditCount: userState.creditAmount / 100,
        })}
        buttonText={t("common.buyCredits")}
      />
    </>
  );
};

export default CreditAmount;
