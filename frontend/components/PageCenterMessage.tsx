import React, { FC, ReactNode } from 'react';
import styles from '@/styles/PageCenterMessage.module.scss';

interface PageCenterMessageProps {
  text: string;
  children?: ReactNode;
}

const PageCenterMessage: FC<PageCenterMessageProps> = ({ text, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>{text}</div>
      {children}
    </div>
  );
};

export default PageCenterMessage;
