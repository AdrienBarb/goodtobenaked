import React, { FC, ReactNode, useState } from "react";
import styles from "@/styles/ProfileIcon.module.scss";
import { Popover } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ProfileIconProps {
  icon: IconProp;
  popoverDescription: string;
}

const ProfileIcon: FC<ProfileIconProps> = ({
  icon,

  popoverDescription,
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const style = {
    maxWidth: "400px",
    fontFamily: "var(--font-karla)",
    fontSize: "14px",
    padding: "0.4rem",
  };

  return (
    <>
      <div
        className={styles.container}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <FontAwesomeIcon size="xs" color={"#1c131e"} icon={icon} />
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div style={style}>{popoverDescription}</div>
      </Popover>
    </>
  );
};

export default ProfileIcon;
