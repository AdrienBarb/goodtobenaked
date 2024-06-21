import React, { FC, ReactNode } from "react";
import styles from "@/styles/PaddingContainer.module.scss";

interface PaddingContainerProps {
  children: ReactNode;
}

const PaddingContainer: FC<PaddingContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default PaddingContainer;
