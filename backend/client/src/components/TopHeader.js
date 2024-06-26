import React from 'react';
import styles from '../styles/TopHeader.module.scss';
import logo from '../logo.svg';
import lipslogo from '../lips-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '@mui/material';
import { screenSizes } from '../constants/screenSizes';

const TopHeader = ({ goBack }) => {
  const matches = useMediaQuery(`(max-width:${screenSizes.md}px)`);

  return (
    <div className={styles.container}>
      <div className={styles.iconsLeft} onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} size="xl" />
      </div>
      {matches ? (
        <div className={styles.lipslogo}>
          <img src={lipslogo} alt="Logo" />
        </div>
      ) : (
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>
      )}
    </div>
  );
};

export default TopHeader;
