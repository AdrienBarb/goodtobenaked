import React, { CSSProperties, MouseEventHandler, FC, ReactNode } from "react";
import styles from "../../styles/Buttons.module.scss";
import clsx from "clsx";
import { Link } from "@/navigation";

interface EmptyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  customStyles?: CSSProperties;
}

const EmptyButton: FC<EmptyButtonProps> = ({
  children,
  onClick,
  href,
  disabled,
  customStyles,
}) => {
  const style: CSSProperties = {
    cursor: disabled ? "inherit" : "pointer",
    color: disabled ? "rgba(0, 0, 0, 0.3)" : "black",
    borderColor: disabled ? "rgba(0, 0, 0, 0.3)" : "black",
    ...customStyles,
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          styles.button,
          styles.emptyButton,
          disabled && styles.disabled
        )}
        style={style}
        prefetch
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={clsx(
        styles.button,
        styles.emptyButton,
        disabled && styles.disabled
      )}
      onClick={handleClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default EmptyButton;
