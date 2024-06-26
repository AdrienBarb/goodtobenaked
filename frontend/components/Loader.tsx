"use client";

import styles from "@/styles/Loader.module.scss";
import { CircularProgress } from "@mui/material";
import { CSSProperties, FC } from "react";

interface LoaderProps {
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  size?: number;
}

const Loader: FC<LoaderProps> = ({ style, containerStyle, size = 32 }) => {
  return (
    <div className={styles.container} style={containerStyle}>
      <CircularProgress sx={{ color: "#1C131E", ...style }} size={size} />
    </div>
  );
};

export default Loader;
