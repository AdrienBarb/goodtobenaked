"use client";

import { PopupButton } from "@typeform/embed-react";
import React from "react";
import styles from "@/styles/ErrorServerPage.module.scss";
import { useTranslations } from "next-intl";

const ReportBugForm = () => {
  const t = useTranslations();

  return (
    <PopupButton
      id="pvX0j4oH"
      style={{ fontSize: 20 }}
      className={styles.reportButton}
    >
      {t("error.report_bug")}
    </PopupButton>
  );
};

export default ReportBugForm;
