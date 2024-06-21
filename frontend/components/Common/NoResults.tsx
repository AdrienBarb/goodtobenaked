import React, { FC } from "react";
import styles from "../../styles/NoResults.module.scss";

interface Props {
  text: string;
}

const NoResults: FC<Props> = ({ text }) => {
  return <div className={styles.container}>{text}</div>;
};

export default NoResults;
