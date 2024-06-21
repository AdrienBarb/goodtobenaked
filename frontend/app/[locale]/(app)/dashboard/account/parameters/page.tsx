import MenuCard from "@/components/MenuCard";
import { useTranslations } from "next-intl";
import React from "react";
import styles from "@/styles/ParametersPage.module.scss";

const ParametersPage = () => {
  const t = useTranslations();

  const menu = [
    {
      label: t("settings.my_account"),
      path: `/dashboard/account/parameters/my-account`,
    },
    {
      label: t("settings.payment"),
      path: `/dashboard/account/parameters/paiements`,
    },
    {
      label: t("settings.notifications"),
      path: `/dashboard/account/parameters/notifications`,
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

export default ParametersPage;
