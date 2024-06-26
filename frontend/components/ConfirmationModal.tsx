import * as React from "react";
import CustomModal from "@/components/Modal";
import { useTranslations } from "next-intl";
import SimpleButton from "./Buttons/SimpleButton";
import Text from "./Text";

interface ConfirmationModalProps {
  setOpen: (e: boolean) => void;
  open: boolean;
  confirmAction: () => void;
  text: string;
  title?: string;
  buttonText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  setOpen,
  open,
  confirmAction,
  text,
  title,
  buttonText,
  isLoading,
}) => {
  const handleValidation = () => {
    confirmAction();
    setOpen(false);
  };

  const t = useTranslations();

  return (
    <CustomModal
      open={open}
      onClose={setOpen}
      withCloseIcon
      title={title || t("common.confirmation")}
      customStyle={{
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <Text textAlign="center">{text}</Text>
      <SimpleButton
        isLoading={isLoading}
        onClick={handleValidation}
        customStyles={{ padding: "0.6rem 1rem" }}
      >
        {buttonText || t("common.confirm")}
      </SimpleButton>
    </CustomModal>
  );
};

export default ConfirmationModal;
