"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/UserSettings.module.scss";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import SettingSectionHeader from "./SettingSectionHeader";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./Buttons/IconButton";
import useApi from "@/lib/hooks/useApi";
import { User } from "@/types/models/User";

const UserSettings = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  //traduction
  const t = useTranslations();

  const { fetchData } = useApi();

  const getCurrentOwner = async () => {
    try {
      const r = await fetchData(`/api/users/owner`);

      setCurrentUser(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentOwner();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.left}>
          <SettingSectionHeader title={t("settings.email")} type="main" />
          <div className={styles.value}>{currentUser?.email}</div>
        </div>

        <IconButton
          icon={faPen}
          href={"/dashboard/account/parameters/my-account/edit/email"}
        />
      </div>
      <Divider sx={{ my: 2 }} />
      <div className={styles.flex}>
        <SettingSectionHeader title={t("settings.password")} type="main" />

        <IconButton
          icon={faPen}
          href={"/dashboard/account/parameters/my-account/edit/password"}
        />
      </div>
      <Divider sx={{ my: 2 }} />
      <div className={styles.flex}>
        <SettingSectionHeader
          title={t("settings.delete_account")}
          type="main"
        />

        <IconButton
          icon={faTrash}
          href={"/dashboard/account/parameters/my-account/edit/delete-account"}
          style={{
            backgroundColor: "red",
          }}
        />
      </div>
    </div>
  );
};

export default UserSettings;
