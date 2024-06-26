"use client";

import React, { FC } from "react";
import LeftCustomDrawer from "./LeftCustomDrawer";
import AppMenu from "./AppMenu";
import styles from "@/styles/MobileMenu.module.scss";

interface Props {
  openDrawer: boolean;
  setOpenDrawer: (e: boolean) => void;
}

const MobileMenu: FC<Props> = ({ openDrawer, setOpenDrawer }) => {
  return (
    <LeftCustomDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
      <div className={styles.container}>
        <AppMenu setOpenDrawer={setOpenDrawer} />
      </div>
    </LeftCustomDrawer>
  );
};

export default MobileMenu;
