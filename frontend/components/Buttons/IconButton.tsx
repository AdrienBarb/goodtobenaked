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
  dataId?: string;
  iconColor?: string;
}

const IconButton: FC<IconButtonProps> = ({
  onClick,
  style,
  icon,
  disabled,
  href,
  dataId,
  iconColor = "white",
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={styles.iconButton}
        style={style}
        data-id={dataId}
        prefetch
      >
        <FontAwesomeIcon icon={icon} color={iconColor} size="lg" />
      </Link>
    );
  }

  return (
    <button
      data-id={dataId}
      className={styles.iconButton}
      style={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.2)" : "#Cecaff",
        ...style,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} color={iconColor} size="lg" />
    </button>
  );
};

export default IconButton;
