"use client";

import React, { useState, FC } from "react";
import styles from "@/styles/ActionTabsMenu.module.scss";
import clsx from "clsx";

interface Props {
  tabs: { label: string; action: () => void }[];
}

const ActionTabsMenu: FC<Props> = ({ tabs }) => {
  const [value, setValue] = useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    tabs[newValue].action();
  };

  return (
    <div className={styles.container}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={clsx(styles.tab, index === value && styles.selected)}
          onClick={() => handleChange(index)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default ActionTabsMenu;
