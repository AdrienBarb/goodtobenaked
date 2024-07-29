import { CircularProgress } from "@mui/material";
import React, { CSSProperties, FC, ReactNode } from "react";
import styles from "../../styles/Buttons.module.scss";
import { Link } from "@/navigation";

interface SimpleButtonProps {
  onClick?: () => void;
  href?: string;
  customStyles?: CSSProperties;
  children?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

const SimpleButton: FC<SimpleButtonProps> = ({
  onClick,
  children,
  customStyles,
  isLoading,
  disabled,
  href,
}) => {
  const style = {
    backgroundColor: disabled ? "rgba(0, 0, 0, 0.1)" : "#Cecaff",
    ...customStyles,
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${styles.button} ${styles.simpleButton}`}
        style={style}
        prefetch
      >
        {isLoading ? (
          <CircularProgress sx={{ color: "#1C131E" }} size={20} />
        ) : (
          children
        )}
      </Link>
    );
  }

  return (
    <button
      className={`${styles.button} ${styles.simpleButton}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: "white" }} size={20} />
      ) : (
        children
      )}
    </button>
  );
};

export default SimpleButton;
