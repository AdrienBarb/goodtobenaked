import React from 'react';
import styles from '../styles/Buttons.module.scss';

const SimpleButton = ({ onClick, children, customStyles, disabled, type }) => {
  const style = {
    color: disabled ? 'rgba(0, 0, 0, 0.3)' : 'white',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.1)' : '#Cecaff',
    cursor: disabled ? 'inherit' : 'cursor',
    ...customStyles,
  };

  return (
    <button
      className={`${styles.button} ${styles.simpleButton}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
