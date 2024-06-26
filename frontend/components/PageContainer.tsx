import React, { CSSProperties, FC, ReactNode } from 'react';
import styles from '@/styles/PageContainer.module.scss';

interface PageContainerProps {
  children: ReactNode;
  containerStyles?: CSSProperties;
  wrapperStyles?: CSSProperties;
}

const PageContainer: FC<PageContainerProps> = ({ children, containerStyles, wrapperStyles }) => {
  return (
    <div className={styles.container} style={containerStyles}>
      <div className={styles.wrapper} style={wrapperStyles}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
