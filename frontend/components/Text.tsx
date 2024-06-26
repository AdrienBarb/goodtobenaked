import React, { CSSProperties, FC, ReactNode } from "react";
import styles from "@/styles/Text.module.scss";

interface Props {
  children: ReactNode;
  customStyles?: CSSProperties;
  weight?: "bolder" | "thiner";
  textAlign?: "left" | "center";
  fontSize?: number;
}

const Text: FC<Props> = ({
  children,
  customStyles,
  fontSize = 16,
  weight,
  textAlign = "left",
}) => {
  return (
    <div className={styles.container} style={customStyles}>
      <p
        style={{
          fontWeight:
            weight === "bolder" ? 600 : weight === "thiner" ? 100 : 300,
          textAlign: textAlign,
          fontSize: `${fontSize}px`,
        }}
      >
        {children}
      </p>
    </div>
  );
};

export default Text;
