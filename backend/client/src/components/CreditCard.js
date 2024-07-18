import React from 'react';
import styles from '../styles/CreditCard.module.scss';

const CreditCard = ({ currentPackage, isSelected, onClick, index }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(index);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={styles.container}
      style={{
        borderColor: isSelected ? '#cecaff' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: isSelected ? '4px' : '2px',
      }}
    >
      <div className={styles.topWrapper}>
        <div className={styles.coins}>{currentPackage.coinsAmount}</div>
        <div className={styles.credit}>CREDITS</div>
      </div>
      <span className={styles.divider}></span>
      <div className={styles.price}>{`${currentPackage.price / 100}€`}</div>

      {/* <div className={styles.bonusWrapper}>
        {currentPackage.bonus && (
          <div className={styles.bonus}>{`${currentPackage.bonus} Bonus`}</div>
        )}
        <div className={styles.pricePerCoins}>
          {`${(currentPackage.price / 100 / currentPackage.coinsAmount).toFixed(
            2,
          )}€/crédits`}
        </div>
      </div> */}
    </div>
  );
};

export default CreditCard;
