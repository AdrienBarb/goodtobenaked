import Modal from "@mui/material/Modal";
import styles from "@/styles/CustomModal.module.scss";
import ModalHeader from "@/components/ModalHeader";
import { CSSProperties, FC, ReactNode } from "react";
import clsx from "clsx";

interface CustomModal {
  open: boolean;
  onClose: (e: boolean) => void;
  children: ReactNode;
  title?: string;
  withCloseIcon?: boolean;
  customStyle?: CSSProperties;
  withHeader?: boolean;
}

const CustomModal: FC<CustomModal> = ({
  open,
  onClose,
  children,
  title,
  withCloseIcon,
  customStyle,
  withHeader = true,
}) => (
  <Modal open={open} onClose={onClose}>
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {withHeader && (
          <ModalHeader
            withCloseIcon={withCloseIcon}
            onClose={onClose}
            title={title}
          />
        )}
        <div className={styles.content} style={customStyle}>
          {children}
        </div>
      </div>
    </div>
  </Modal>
);

export default CustomModal;
