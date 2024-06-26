import { Link } from "@/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, ReactNode } from "react";
import styles from "@/styles/BackButton.module.scss";

interface Props {
  prevPath: string;
  children?: ReactNode;
}

const BackButton: FC<Props> = ({ prevPath, children }) => {
  return (
    <div className={styles.container}>
      <Link href={prevPath} prefetch>
        <FontAwesomeIcon icon={faArrowLeft} size="xl" />
      </Link>
      {children && children}
    </div>
  );
};

export default BackButton;
