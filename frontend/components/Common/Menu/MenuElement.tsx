import React, { CSSProperties, FC, ReactNode } from "react";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  children: ReactNode;
  onClick: () => void;
  customStyles?: CSSProperties;
}

const MenuElement: FC<Props> = ({ children, onClick, customStyles }) => {
  return (
    <MenuItem
      sx={{
        fontWeight: "600",
        ...customStyles,
      }}
      onClick={onClick}
    >
      {children}
    </MenuItem>
  );
};

export default MenuElement;
