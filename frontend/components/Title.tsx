import React, { CSSProperties, FC, ReactNode } from "react";
import styles from "@/styles/Title.module.scss";

interface Props {
  Tag: "h1" | "h2" | "h3" | "h4";
  children: ReactNode;
  customStyles?: CSSProperties;
  titleStyle?: CSSProperties;
  dataId?: string;
}

const Title: FC<Props> = ({
  Tag,
  children,
  customStyles,
  titleStyle,
  dataId,
}) => {
  return (
    <span className={styles.container} style={customStyles}>
      <Tag data-id={dataId} style={titleStyle}>
        {children}
      </Tag>
    </span>
  );
};

export default Title;
