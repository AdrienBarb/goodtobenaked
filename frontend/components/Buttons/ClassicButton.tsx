import React, { CSSProperties, MouseEventHandler, FC, ReactNode } from "react";
import styles from "../../styles/Buttons.module.scss";
import clsx from "clsx";
import { CircularProgress } from "@mui/material";

interface ClassicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  customStyles?: CSSProperties;
}

const ClassicButton: FC<ClassicButtonProps> = ({
  children,
  onClick,
  customStyles,
  isLoading,
}) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={clsx(styles.button, styles.classicButton)}
      onClick={handleClick}
      style={customStyles}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: "#1C131E" }} size={20} />
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
};

export default ClassicButton;
