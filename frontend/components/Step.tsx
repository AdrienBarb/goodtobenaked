import React, { FC, ReactNode } from "react";
import styles from "@/styles/Step.module.scss";

interface Props {
  children: ReactNode;
  complete: boolean;
}

const Step: FC<Props> = ({ complete, children }) => {
  const style = {
    backgroundColor: complete ? "#Cecaff" : "transparent",
  };
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};

export default Step;
