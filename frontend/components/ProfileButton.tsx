import React, { FC, ReactNode, useState } from "react";
import styles from "@/styles/ProfileButton.module.scss";
import { CircularProgress, Popover } from "@mui/material";

interface ProfileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isFull?: boolean;
  isLoading?: boolean;
}

const ProfileButton: FC<ProfileButtonProps> = ({
  children,
  onClick,
  isLoading,
  isFull = false,
}) => {
  return (
    <button
      className={styles.container}
      style={{
        backgroundColor: isFull ? "#Cecaff" : "#FFF0EB",
        color: isFull ? "#FFF0EB" : "#Cecaff",
      }}
      onClick={onClick}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: "#1C131E" }} size={12} />
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
};

export default ProfileButton;
