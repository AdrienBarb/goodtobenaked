import React, { FC, ReactNode } from "react";
import styles from "@/styles/FiltersWrapper.module.scss";

interface FiltersWrapperProps {
  children: ReactNode;
}

const FiltersWrapper: FC<FiltersWrapperProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default FiltersWrapper;
