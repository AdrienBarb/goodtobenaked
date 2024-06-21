import { CircularProgress } from '@mui/material';
import React, { FC, CSSProperties } from 'react';
import styles from '../../styles/Buttons.module.scss';
import EditIcon from '@mui/icons-material/Edit';

interface EditIconButtonProps {
  onClick: (e?: any) => void;
  style?: CSSProperties;
}

const EditIconButton: FC<EditIconButtonProps> = ({ onClick, style }) => {
  return (
    <div className={styles.iconButton} style={style} onClick={onClick}>
      <EditIcon fontSize="small" sx={{ color: '#FFF0EB' }} />
    </div>
  );
};

export default EditIconButton;
