import React, { FC, ReactNode } from "react";
import styles from "@/styles/SmallLayoutContainer.module.scss";

interface Props {
  children: ReactNode;
}

const SmallLayoutContainer: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container} style={{}}>
      {children}
    </div>
  );
};

export default SmallLayoutContainer;
