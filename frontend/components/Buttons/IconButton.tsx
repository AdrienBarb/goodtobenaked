import React, { FC, CSSProperties } from "react";
import styles from "../../styles/Buttons.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link } from "@/navigation";

interface IconButtonProps {
  onClick?: (e?: any) => void;
  style?: CSSProperties;
  icon: IconDefinition;
  disabled?: boolean;
  href?: string;
}

const IconButton: FC<IconButtonProps> = ({
  onClick,
  style,
  icon,
  disabled,
  href,
}) => {
  if (href) {
    return (
      <Link href={href} className={styles.iconButton} style={style} prefetch>
        <FontAwesomeIcon icon={icon} color="white" size="lg" />
      </Link>
    );
  }

  return (
    <button
      className={styles.iconButton}
      style={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.2)" : "#Cecaff",
        ...style,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} color="white" size="lg" />
    </button>
  );
};

export default IconButton;
