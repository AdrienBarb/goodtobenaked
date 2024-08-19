import React, { FC } from "react";
import styles from "@/styles/NudeCardCreditAmount.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import Text from "./Text";
import { useTranslations } from "next-intl";

interface Props {
  creditAmount: number;
}

const NudeCardCreditAmount: FC<Props> = ({ creditAmount }) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faSackDollar} fixedWidth color="white" size="sm" />
      <Text fontSize={12} customStyles={{ color: "white" }}>
        {t("common.nudeCardCreditAmount", { creditAmount })}
      </Text>
    </div>
  );
};

export default NudeCardCreditAmount;
