import React, { CSSProperties, FC, ReactNode } from 'react';
import styles from '@/styles/Title.module.scss';

interface Props {
  Tag: 'h1' | 'h2' | 'h3' | 'h4';
  children: ReactNode;
  customStyles?: CSSProperties;
}

const Title: FC<Props> = ({ Tag, children, customStyles }) => {
  return (
    <span className={styles.container} style={customStyles}>
      <Tag>{children}</Tag>
    </span>
  );
};

export default Title;
