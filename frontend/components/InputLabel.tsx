import React, { FC, ReactNode } from "react";
import styles from "@/styles/InputLabel.module.scss";

interface InputLabelProps {
  label: string;
  subLabel?: string | ReactNode;
}

const InputLabel: FC<InputLabelProps> = ({ label, subLabel }) => {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      {subLabel && <div className={styles.subLabel}>{subLabel}</div>}
    </div>
  );
};

export default InputLabel;
