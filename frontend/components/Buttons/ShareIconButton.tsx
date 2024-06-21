import React, { FC, CSSProperties } from "react";
import styles from "../../styles/Buttons.module.scss";
import ShareIcon from "@mui/icons-material/Share";

interface ShareIconButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

const ShareIconButton: FC<ShareIconButtonProps> = ({ onClick, style }) => {
  return (
    <div className={styles.iconButton} style={style} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <ShareIcon sx={{ color: "#FFF0EB" }} />
      </div>
    </div>
  );
};

export default ShareIconButton;
