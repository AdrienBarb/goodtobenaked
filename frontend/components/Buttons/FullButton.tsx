import React, { FC, CSSProperties, ReactNode, MouseEventHandler } from "react";
import styles from "../../styles/Buttons.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import clsx from "clsx";
import { Link } from "@/navigation";

interface Props {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  customStyles?: CSSProperties;
  isLoading?: boolean;
  children: ReactNode;
}

const FullButton: FC<Props> = ({
  onClick,
  disabled,
  customStyles,
  href,
  isLoading,
  children,
}) => {
  const style = {
    width: "fit-content",
    color: disabled ? "rgba(0, 0, 0, 0.5)" : "black",
    borderColor: disabled ? "rgba(0, 0, 0, 0.3)" : "black",
    backgroundColor: disabled ? "rgba(0, 0, 0, 0.2)" : "#Cecaff",
    ...customStyles,
  };

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          styles.button,
          styles.fullButton,
          disabled && styles.disabled
        )}
        style={style}
        prefetch
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        styles.button,
        styles.fullButton,
        disabled && styles.disabled
      )}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: "#1C131E" }} size={20} />
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
};

export default FullButton;
