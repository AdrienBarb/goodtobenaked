import React, { FC, ReactNode } from "react";
import styles from "@/styles/InputWrapper.module.scss";
import InputLabel from "./InputLabel";

interface InputWrapperProps {
  label: string;
  subLabel?: string | ReactNode;
  children: ReactNode;
}

const InputWrapper: FC<InputWrapperProps> = ({ label, subLabel, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <InputLabel label={label} subLabel={subLabel} />
      </div>
      {children}
    </div>
  );
};

export default InputWrapper;
