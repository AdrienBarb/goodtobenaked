"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FullButton from "./Buttons/FullButton";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";

const LandingButton = () => {
  const t = useTranslations();

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    router.push("/dashboard/feed");
  };

  return (
    <FullButton onClick={handleClick}>
      {status === "unauthenticated"
        ? t("home.getStarted")
        : t("home.exploreNudes")}
    </FullButton>
  );
};

export default LandingButton;
