"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/UserSettings.module.scss";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import SettingSectionHeader from "./SettingSectionHeader";
import IconButton from "./Buttons/IconButton";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import useApi from "@/lib/hooks/useApi";
import ReferralTable from "./ReferralTable";
import { useSession } from "next-auth/react";

const ReferralPageBody = () => {
  const [referrals, setReferrals] = useState([]);
  const { data: session } = useSession();

  const t = useTranslations();

  const { fetchData } = useApi();

  const getReferrals = async () => {
    try {
      const r = await fetchData(`/api/users/referrals`);

      setReferrals(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReferrals();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}/fr/register?referral=${session?.user?.id}`
      );
      toast.success("Lien copié");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <SettingSectionHeader
          title={t("referral.referree_link")}
          subTitle={t("referral.referral_explanation")}
          type="main"
        />
        <IconButton icon={faCopy} onClick={copyToClipboard} />
      </div>

      <Divider sx={{ my: 2 }} />
      <SettingSectionHeader title={t("referral.referrals")} type="main" />
      <ReferralTable referrals={referrals} />
    </div>
  );
};

export default ReferralPageBody;
