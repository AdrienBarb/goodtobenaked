"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/UserSettings.module.scss";
import { useTranslations } from "next-intl";
import IconButton from "./Buttons/IconButton";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import SettingSectionHeader from "./SettingSectionHeader";
import useApi from "@/lib/hooks/useApi";
import { User } from "@/types/models/User";
import Text from "./Text";
import { useRouter } from "@/navigation";

const PaymentSettings = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  //traduction
  const t = useTranslations();

  const router = useRouter();

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
        <SettingSectionHeader title={t("settings.bank_account")} type="main" />

        <IconButton
          icon={faPen}
          onClick={() =>
            router.push("/dashboard/account/parameters/paiements/edit")
          }
        />
      </div>
      <Text>
        {t("settings.nameAccountLabel", {
          accountName: currentUser?.bankAccount?.name
            ? currentUser.bankAccount.name
            : "-",
        })}
      </Text>
      <Text>
        {t("settings.ibanAccountLabel", {
          ibanValue: currentUser?.bankAccount?.iban
            ? currentUser.bankAccount.iban
            : "-",
        })}
      </Text>
      <Text>
        {t("settings.addressAccountLabel", {
          addressValue: currentUser?.bankAccount?.address
            ? `${currentUser?.bankAccount?.address?.street}, ${currentUser?.bankAccount?.address?.zip}, ${currentUser?.bankAccount?.address?.city}, ${currentUser?.bankAccount?.address?.country}`
            : "-",
        })}
      </Text>
    </div>
  );
};

export default PaymentSettings;
