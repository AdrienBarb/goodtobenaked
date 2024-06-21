import React, { useState, FC, ReactNode } from "react";
import Popover from "@mui/material/Popover";

interface Props {
  children: ReactNode;
  description: string;
}

const SimplePopover: FC<Props> = ({ children, description }) => {
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
    fontFamily: "Karla",
    fontSize: "14px",
    padding: "0.4rem",
  };

  return (
    <>
      <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        {children}
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
        <div style={style}>{description}</div>
      </Popover>
    </>
  );
};

export default SimplePopover;
