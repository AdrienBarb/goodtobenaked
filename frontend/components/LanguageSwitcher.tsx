"use client";

import React from "react";
import Button from "@mui/material/Button";
import styles from "@/styles/LanguageSwitcher.module.scss";
import { Popover } from "@mui/material";
import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import clsx from "clsx";

const languages: { label: "FR" | "EN"; value: "fr" | "en" }[] = [
  { label: "FR", value: "fr" },
  { label: "EN", value: "en" },
];

const LanguageSwitcher = () => {
  //other
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //router
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (value: "fr" | "en") => {
    router.push(pathname, { locale: value });
  };

  if (!locale) {
    return <></>;
  }

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
          fontWeight: "200",
          minWidth: "inherit",
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <div>{locale.toUpperCase()}</div>
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
        {languages.map((currentLanguage, index) => {
          return (
            <div
              key={index}
              className={clsx(
                styles.menuItems,
                locale === currentLanguage.value && styles.selected
              )}
              onClick={() => handleChange(currentLanguage.value)}
            >
              {currentLanguage.label}
            </div>
          );
        })}
      </Popover>
    </div>
  );
};

export default LanguageSwitcher;
