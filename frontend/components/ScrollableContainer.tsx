import React, { FC, ReactNode } from "react";
import styles from "@/styles/ScrollableContainer.module.scss";

interface Props {
  children: ReactNode;
}

const ScrollableContainer: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container} style={{}}>
      {children}
    </div>
  );
};

export default ScrollableContainer;
