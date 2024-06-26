import React, { FC, CSSProperties } from 'react';
import styles from '../../styles/Buttons.module.scss';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FavIconButtonProps {
  isFavorite: boolean;
  onClick: (e?: any) => void;
  style?: CSSProperties;
}

const FavIconButton: FC<FavIconButtonProps> = ({ onClick, style, isFavorite }) => {
  return (
    <div className={styles.iconButton} style={style} onClick={onClick}>
      {isFavorite ? (
        <FavoriteIcon style={{ color: 'red' }} />
      ) : (
        <FavoriteBorderIcon style={{ color: '#FFF0EB' }} />
      )}
    </div>
  );
};

export default FavIconButton;
