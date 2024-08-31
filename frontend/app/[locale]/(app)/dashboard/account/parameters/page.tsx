"use client";

import MenuCard from "@/components/MenuCard";
import { useTranslations } from "next-intl";
import React from "react";
import styles from "@/styles/ParametersPage.module.scss";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const ParametersPage = () => {
  const t = useTranslations();
  const { data: session } = useSession();

  console.log(session?.user);

  const menu = [
    {
      label: t("settings.my_account"),
      path: `/dashboard/account/parameters/my-account`,
      condition:
        session?.user?.userType === "creator" ||
        session?.user?.userType === "member",
    },
    {
      label: t("settings.payment"),
      path: `/dashboard/account/parameters/paiements`,
      condition: session?.user?.userType === "creator",
    },
    {
      label: t("settings.notifications"),
      path: `/dashboard/account/parameters/notifications`,
      condition:
        session?.user?.userType === "creator" ||
        session?.user?.userType === "member",
    },
    {
      label: t("settings.preferences"),
      path: `/dashboard/account/parameters/preferences`,
      condition: session?.user?.userType === "member",
    },
  ];

  return (
    <div className={styles.container}>
      {menu.map((m, index) => {
        if (!m.condition) {
          return;
        }

        return <MenuCard key={index} label={m.label} path={m.path} />;
      })}
    </div>
  );
};

export default ParametersPage;
