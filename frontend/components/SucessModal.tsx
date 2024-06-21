import * as React from "react";
import { useTranslations } from "next-intl";
import CustomModal from "./Modal";
import SimpleButton from "./Buttons/SimpleButton";
import Text from "./Text";

interface Props {
  setOpen: (e: boolean) => void;
  open: boolean;
  title: string;
  text: string;
}

const SuccessModal: React.FC<Props> = ({ setOpen, open, title, text }) => {
  const t = useTranslations();

  return (
    <CustomModal
      open={open}
      onClose={setOpen}
      withCloseIcon
      title={title}
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
        onClick={() => setOpen(false)}
        customStyles={{ padding: "0.6rem 1rem" }}
      >
        {t("common.close")}
      </SimpleButton>
    </CustomModal>
  );
};

export default SuccessModal;
