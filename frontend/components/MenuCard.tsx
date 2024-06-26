import React, { FC } from "react";
import styles from "@/styles/MenuCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/navigation";

interface MenuCardProps {
  label: string;
  path: string;
}

const MenuCard: FC<MenuCardProps> = ({ label, path }) => {
  return (
    <Link prefetch href={path}>
      <div className={styles.container}>
        {label}
        <FontAwesomeIcon icon={faChevronRight} size="xs" />
      </div>
    </Link>
  );
};

export default MenuCard;
