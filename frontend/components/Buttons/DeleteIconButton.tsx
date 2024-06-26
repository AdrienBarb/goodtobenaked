import React, { CSSProperties, FC } from "react";
import styles from "../../styles/Buttons.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteIconButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

const DeleteIconButton: FC<DeleteIconButtonProps> = ({ onClick, style }) => {
  return (
    <div className={styles.iconButton} style={style} onClick={onClick}>
      <DeleteIcon fontSize="small" sx={{ color: "#FFF0EB" }} />
    </div>
  );
};

export default DeleteIconButton;
