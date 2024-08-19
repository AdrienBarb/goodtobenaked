import React, { FC, useState } from "react";
import FullButton from "@/components/Buttons/FullButton";
import { Nude } from "@/types/models/Nude";
import { useTranslations } from "next-intl";
import ConfirmationModal from "../ConfirmationModal";
import useNavigateToPayment from "@/lib/hooks/useNavigateToPayment";
import { useSession } from "next-auth/react";
import useApi from "@/lib/hooks/useApi";
import SimpleButton from "./SimpleButton";
import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "@/store/store";
import { getCreditAmount } from "@/features/user/userSlice";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";

interface Props {
  nude: Nude;
  callback: (e: Nude) => void;
}

const BuyMediaButton: FC<Props> = ({ nude, callback }) => {
  //session
  const { data: session, status } = useSession();

  //redux
  const dispatch = useAppDispatch();
  const userState = useSelector((state: RootStateType) => state.user);

  //localstate
  const [openCreditModal, setOpenCreditModal] = React.useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  //hooks
  const navigateToPayment = useNavigateToPayment();
  const { usePost } = useApi();
  const { mutate: buyNude, isLoading } = usePost("/api/nudes/buy", {
    onSuccess: (updatedNude) => {
      dispatch(getCreditAmount());

      if (session?.user?.id) {
        callback(updatedNude);
      }
    },
  });

  //translations
  const t = useTranslations();

  const redirectToLoginPage = useRedirectToLoginPage();

  const handleBuyClick = () => {
    if (status === "unauthenticated") {
      redirectToLoginPage();
      return;
    }

    if (userState.creditAmount < nude.priceDetails.creditPrice) {
      setOpenCreditModal(true);
      return;
    }

    setOpenConfirmationModal(true);
  };

  const handleBuyNude = () => {
    buyNude({ nudeId: nude._id });
  };

  return (
    <>
      <SimpleButton
        onClick={handleBuyClick}
        isLoading={isLoading}
        customStyles={{
          padding: "0.4rem 0.8rem",
          position: "absolute",
          width: "100%",
          maxWidth: "260px",
          minHeight: "40px",
        }}
      >
        {t("common.unlockForCredit", {
          creditNumber: nude.priceDetails.creditPrice / 100,
        })}
      </SimpleButton>
      <ConfirmationModal
        open={openCreditModal}
        setOpen={setOpenCreditModal}
        confirmAction={navigateToPayment}
        title={t("common.shouldByCredits")}
        text={t("common.notEnoughCredit")}
        buttonText={t("common.buyCredits")}
      />
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        isLoading={isLoading}
        confirmAction={handleBuyNude}
        text={t("common.unlockCreditConfirmation", {
          creditNumber: nude.priceDetails.creditPrice / 100,
        })}
        buttonText={t("common.unlockNow")}
      />
    </>
  );
};

export default BuyMediaButton;
