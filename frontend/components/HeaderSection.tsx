import React, { FC, ReactNode } from "react";
import styles from "@/styles/HeaderSection.module.scss";
import Title from "./Title";

interface Props {
  title: string;
  children?: ReactNode;
}

const HeaderSection: FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Title Tag="h3">{title}</Title>
        {children && children}
      </div>
      <span className={styles.divider}></span>
    </div>
  );
};

export default HeaderSection;
