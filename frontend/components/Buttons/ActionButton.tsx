import { CircularProgress } from "@mui/material";
import React, { CSSProperties, FC, ReactNode } from "react";
import styles from "@/styles/Buttons.module.scss";

interface ActionButtonProps {
  onClick: (e?: any) => void;
  customStyles?: CSSProperties;
  isLoading?: boolean;
  children: ReactNode;
}

const ActionButton: FC<ActionButtonProps> = ({ onClick, children, customStyles, isLoading }) => {
  const style = {
    ...customStyles
  };

  return (
    <div
      className={`${styles.button} ${styles.actionButton}`}
      onClick={onClick}
      style={style}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: '#1C131E' }} size={16} />
      ) : (
        children
      )}
    </div>
  );
};

export default ActionButton;
