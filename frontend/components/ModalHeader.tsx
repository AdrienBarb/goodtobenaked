import React, { useState, FC } from "react";
import styles from "@/styles/ModalHeader.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ModalHeaderProps {
  withCloseIcon?: boolean;
  onClose?: (value: boolean) => void;
  title?: string;
  withBackAction?: boolean;
  backAction?: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  withCloseIcon,
  onClose,
  title,
  withBackAction,
  backAction,
}) => {
  return (
    <div className={styles.container}>
      {withBackAction && (
        <div
          className={styles.backIconWrapper}
          onClick={() => {
            if (backAction) {
              backAction();
            }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 26, color: "black" }} />
        </div>
      )}
      <div className={styles.title}>{title ? title : ""}</div>
      {withCloseIcon && (
        <div
          className={styles.closeIconWrapper}
          onClick={() => {
            if (onClose) {
              onClose(false);
            }
          }}
        >
          <CloseIcon sx={{ fontSize: 26, color: "#fff0eb" }} />
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
