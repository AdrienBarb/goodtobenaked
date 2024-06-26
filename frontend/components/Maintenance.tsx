import React from "react";
import styles from "@/styles/Maintenance.module.scss";
import { useTranslations } from "next-intl";

const Maintenance = ({}) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>{t("common.maintenanceMessageTitle")}</h1>
        <p>{t("common.maintenanceMessage1")}</p>
        <p>{t("common.maintenanceMessage2")}</p>
        <p>{t("common.maintenanceMessage3")}</p>
      </div>
    </div>
  );
};

export default Maintenance;
