import React, { FC } from "react";
import styles from "@/styles/Navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Media } from "@/types/models/Media";

interface Props {
  setCurrentMediaIndex: (update: (previousNumber: number) => number) => void;
  medias: Media[];
}

const Navigation: FC<Props> = ({ setCurrentMediaIndex, medias }) => {
  const navigateLeft = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCurrentMediaIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : medias.length - 1
    );
  };

  const navigateRight = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % medias.length);
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.navigationButton} onClick={navigateLeft}>
        <FontAwesomeIcon icon={faChevronLeft} size="2x" />
      </div>
      <div className={styles.navigationButton} onClick={navigateRight}>
        <FontAwesomeIcon icon={faChevronRight} size="2x" />
      </div>
    </div>
  );
};

export default Navigation;
