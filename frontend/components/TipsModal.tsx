import React, { FC, useState } from "react";
import styles from "@/styles/TipsModal.module.scss";
import CustomModal from "@/components/Modal";
import { useTranslations } from "next-intl";
import SimpleButton from "./Buttons/SimpleButton";
import useApi from "@/lib/hooks/useApi";
import ConfirmationModal from "./ConfirmationModal";
import useNavigateToPayment from "@/lib/hooks/useNavigateToPayment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "@/store/store";
import { getCreditAmount } from "@/features/user/userSlice";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  userId: string;
}

const TipsModal: FC<Props> = ({ open, setOpen, userId }) => {
  const t = useTranslations();

  const { usePost } = useApi();

  const tipsValue = [
    { value: 2, label: `💋 2` },
    { value: 5, label: `💐 5` },
    { value: 10, label: `🎁 10` },
    { value: 20, label: `💝 20` },
  ];

  const [tipValue, setTipValue] = useState<number>(2);
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const navigateToPayment = useNavigateToPayment();

  //redux
  const userState = useSelector((state: RootStateType) => state.user);
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);

    setTipValue(newValue);
  };

  const { mutate: sendTips, isLoading } = usePost(`/api/users/send-tips`, {
    onSuccess: (creditAmount) => {
      dispatch(getCreditAmount());
      toast(
        t("common.youSendCreditAmount", { creditAmount: creditAmount / 100 }),
        {
          icon: "❤️",
        }
      );
      setOpen(false);
    },
  });

  const handleSendTips = () => {
    if (userState.creditAmount < tipValue) {
      setOpenCreditModal(true);
      return;
    }

    sendTips({
      userId: userId,
      tipsAmount: tipValue,
    });
  };

  return (
    <>
      <CustomModal open={open} onClose={setOpen} withCloseIcon>
        <div className={styles.container} data-id="tips-modal">
          <div className={styles.creditWrapper}>
            <span className={styles.creditlabel}>
              {t("common.youreGonnaSend")}
            </span>
            <input
              type="number"
              value={tipValue}
              className={styles.creditAmount}
              onChange={handleInputChange}
              min={1}
              step={1}
              pattern="\d+"
            />
            <span className={styles.creditlabel}>{t("common.credits")}</span>
          </div>
          <div className={styles.wrapper}>
            {tipsValue.map((currentTip, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setTipValue(currentTip.value)}
                  className={styles.tipCard}
                >
                  {currentTip.label}
                </div>
              );
            })}
          </div>
          <SimpleButton
            onClick={handleSendTips}
            customStyles={{ padding: "0.6rem 1rem" }}
            isLoading={isLoading}
          >
            {t("profile.sendTips")}
          </SimpleButton>
        </div>
      </CustomModal>
      <ConfirmationModal
        open={openCreditModal}
        setOpen={setOpenCreditModal}
        confirmAction={navigateToPayment}
        title={t("common.shouldByCredits")}
        text={t("common.notEnoughCredit")}
        buttonText={t("common.buyCredits")}
      />
    </>
  );
};

export default TipsModal;
