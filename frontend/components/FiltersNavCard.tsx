import React, { FC } from "react";
import styles from "@/styles/FiltersNavCard.module.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslations } from "next-intl";

interface Props {
  text: string;
  onClick: () => void;
  currentFilter: string;
}

const FiltersNavCard: FC<Props> = ({ text, onClick, currentFilter }) => {
  const t = useTranslations();

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.text}>{text}</div>
      <div className={styles.arrowWrapper}>
        {currentFilter && t(`db.${currentFilter}`)}
        <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />
      </div>
    </div>
  );
};

export default FiltersNavCard;
