"use client";

import React, { FC } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudeCard.module.scss";
import NudeCardUserMenu from "./NudeCardUserMenu";
import useIsOwner from "@/lib/hooks/useIsOwner";
import DisplayedMedia from "./DisplayedMedia";
import MediaDetails from "./MediaDetails";
import useCanView from "@/lib/hooks/useCanView";

import { Link } from "@/navigation";
import { useParams } from "next/navigation";
import NudeCardCreditAmount from "./NudeCardCreditAmount";
import BlurMedia from "./BlurMedia";

interface Props {
  nude: Nude;
  showUserMenu?: boolean;
  setNudeList?: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
  itemNumber?: number;
}

const NudeCard: FC<Props> = ({
  nude,
  showUserMenu,
  setNudeList,
  itemNumber = 0,
}) => {
  const isOwner = useIsOwner(nude.user._id);
  const canView = useCanView(nude);
  const { userId } = useParams();

  return (
    <div className={styles.container} data-id={`user-nude-${itemNumber}`}>
      {showUserMenu && isOwner && (
        <div className={styles.userMenuWrapper}>
          <NudeCardUserMenu nude={nude} setNudeList={setNudeList} />
        </div>
      )}
      <MediaDetails medias={nude.medias} />
      <Link href={`/dashboard/community/gallery/${userId}#item-${nude._id}`}>
        <DisplayedMedia nude={nude} currentMediaIndex={0} type="card" />
        {!canView && !isOwner && <BlurMedia />}

        {!canView && isOwner && (
          <NudeCardCreditAmount
            creditAmount={nude.priceDetails.creditPrice / 100}
          />
        )}
      </Link>
    </div>
  );
};

export default NudeCard;
