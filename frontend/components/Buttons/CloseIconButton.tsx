import { CircularProgress } from '@mui/material';
import React, { FC, CSSProperties } from 'react';
import styles from '../../styles/Buttons.module.scss';
import CloseIcon from '@mui/icons-material/Close';

interface CloseIconButtonProps {
  onClick: (e?: any) => void;
  style?: CSSProperties;
}

const CloseIconButton: FC<CloseIconButtonProps> = ({ onClick, style }) => {
  return (
    <div className={styles.iconButton} style={style} onClick={onClick}>
      <CloseIcon sx={{ fontSize: 26, color: '#fff0eb' }} />
    </div>
  );
};

export default CloseIconButton;
