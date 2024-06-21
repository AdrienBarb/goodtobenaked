import React, { FC } from "react";
import styles from "@/styles/ContainerWithBackArrow.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/navigation";

interface Props {
  prevPath: string;
}

const ContainerWithBackArrow: FC<Props> = ({ prevPath }) => {
  return (
    <div className={styles.container}>
      <Link href={prevPath} prefetch>
        <FontAwesomeIcon icon={faArrowLeft} size="sm" />
      </Link>
    </div>
  );
};

export default ContainerWithBackArrow;
