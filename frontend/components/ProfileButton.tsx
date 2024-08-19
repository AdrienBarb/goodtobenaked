import React, { FC, ReactNode, useState } from "react";
import styles from "@/styles/ProfileButton.module.scss";
import { CircularProgress, Popover } from "@mui/material";

interface ProfileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isFull?: boolean;
  isLoading?: boolean;
  dataId?: string;
}

const ProfileButton: FC<ProfileButtonProps> = ({
  children,
  onClick,
  isLoading,
  isFull = false,
  dataId,
}) => {
  return (
    <button
      className={styles.container}
      style={{
        backgroundColor: isFull ? "#Cecaff" : "#FFF0EB",
        color: isFull ? "#FFF0EB" : "#Cecaff",
      }}
      onClick={onClick}
      data-id={dataId}
    >
      {isLoading ? (
        <CircularProgress
          sx={{ color: isFull ? "white " : "#d9d7f6" }}
          size={12}
        />
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
};

export default ProfileButton;
