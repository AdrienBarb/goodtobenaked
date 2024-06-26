import React from "react";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import styles from "@/styles/CreatorAddMenu.module.scss";
import { Popover } from "@mui/material";
import { useRouter } from "@/navigation";

const UserAddMenu = () => {
  //other
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //router
  const router = useRouter();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNav = (path: string) => {
    setAnchorEl(null);
    router.push(path);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          padding: "0",
          color: "black",
          minWidth: "inherit",
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <AddCircleIcon
          sx={{
            fontSize: "48",
            cursor: "pointer",
            color: anchorEl ? "#cecaff" : "#1C131E",
          }}
        />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginTop: "0.4rem",
          },
        }}
      >
        <div
          className={styles.menuItems}
          onClick={() => handleNav("/dashboard/account/add/nudes")}
        >
          Nudes
        </div>
      </Popover>
    </div>
  );
};

export default UserAddMenu;
