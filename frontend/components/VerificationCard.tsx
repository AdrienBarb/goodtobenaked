import React, { FC } from "react";
import styles from "@/styles/VerificationCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/navigation";

interface VerificationCardProps {
  isValid: boolean;
  label: string;
  path: string;
}

const VerificationCard: FC<VerificationCardProps> = ({
  isValid,
  label,
  path,
}) => {
  return (
    <Link
      href={path}
      prefetch
      className={styles.container}
      style={{
        backgroundColor: isValid ? "#cecaff" : "transparent",
        color: isValid ? "white" : "black",
      }}
    >
      <div>
        <div className={styles.label}>{label}</div>
      </div>
      <div>
        {isValid ? (
          <FontAwesomeIcon icon={faCheck} size="1x" />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} size="1x" />
        )}
      </div>
    </Link>
  );
};

export default VerificationCard;
