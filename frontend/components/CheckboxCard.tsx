import React, { FC } from "react";
import styles from "@/styles/CheckboxCard.module.scss";
import CustomCheckbox from "./CustomCheckbox";

interface CheckboxCardProps {
  text: string;
  onClick?: () => void;
  checked: boolean;
  onChange: () => void;
  value?: boolean;
}

const CheckboxCard: FC<CheckboxCardProps> = ({
  text,
  onClick,
  checked,
  onChange,
  value,
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.text}>{text}</div>
      <CustomCheckbox
        checked={checked}
        onChange={onChange}
        value={value}
        styles={{ padding: "0" }}
      />
    </div>
  );
};

export default CheckboxCard;
