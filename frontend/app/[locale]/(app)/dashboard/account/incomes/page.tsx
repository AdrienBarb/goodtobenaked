import React from "react";
import styles from "@/styles/IncomesPage.module.scss";
import MenuCard from "@/components/MenuCard";
import { useTranslations } from "next-intl";

const IncomesPage = () => {
  const t = useTranslations();

  const menu = [
    {
      label: t("incomes.summary"),
      path: `/dashboard/account/incomes/summary`,
    },
    {
      label: t("incomes.sales"),
      path: `/dashboard/account/incomes/sales`,
    },
    {
      label: t("incomes.invoices"),
      path: `/dashboard/account/incomes/invoices`,
    },
  ];

  return (
    <div className={styles.container}>
      {menu.map((m, index) => {
        return <MenuCard key={index} label={m.label} path={m.path} />;
      })}
    </div>
  );
};

export default IncomesPage;
