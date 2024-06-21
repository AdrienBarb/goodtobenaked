import React, { ReactNode, FC } from "react";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";

const StyledDrawer = styled(Drawer)(() => ({
  "& .MuiPaper-root": {
    width: "250px",
    backgroundColor: "#FFF0EB",
  },
}));

interface Props {
  children: ReactNode;
  openDrawer: boolean;
  setOpenDrawer: (e: boolean) => void;
}

const LeftCustomDrawer: FC<Props> = ({
  children,
  openDrawer,
  setOpenDrawer,
}) => {
  const toggleDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <StyledDrawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
      <CloseIcon
        sx={{
          position: "absolute",
          right: "0.6rem",
          top: "0.6rem",
          color: "#68738B",
          cursor: "pointer",
        }}
        onClick={() => setOpenDrawer(false)}
      />
      {children}
    </StyledDrawer>
  );
};

export default LeftCustomDrawer;
