"use client";

import React from "react";
import styles from "@/styles/DashboardMenu.module.scss";
import AppMenu from "./AppMenu";

const DashboardMenu = () => {
  return (
    <div className={styles.container}>
      <AppMenu />
    </div>
  );
};

export default DashboardMenu;
