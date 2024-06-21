"use client";

import React, { FC } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudeCard.module.scss";
import NudeCardUserMenu from "./NudeCardUserMenu";
import NudeUserDetails from "./NudeUserDetails";
import useIsOwner from "@/lib/hooks/useIsOwner";
import MediaWrapper from "./Media/MediaWrapper";

interface Props {
  nude: Nude;
  showUserMenu?: boolean;
  display: "post" | "card";
  setNudeList?: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
}

const NudeCard: FC<Props> = ({ nude, showUserMenu, display, setNudeList }) => {
  const isOwner = useIsOwner(nude.user._id);

  if (display === "post") {
    return (
      <div className={styles.postContainer}>
        <div className={styles.userDetailsWrapper}>
          <NudeUserDetails nude={nude} showAvatar />
        </div>
        <MediaWrapper nude={nude} />
      </div>
    );
  }

  if (display === "card") {
    return (
      <div className={styles.container}>
        {showUserMenu && isOwner && (
          <div className={styles.userMenuWrapper}>
            <NudeCardUserMenu nude={nude} setNudeList={setNudeList} />
          </div>
        )}
        <MediaWrapper nude={nude} />
      </div>
    );
  }

  return <></>;
};

export default NudeCard;
