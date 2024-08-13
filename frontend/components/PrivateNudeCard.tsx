"use client";

import React, { FC, useState } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudeCard.module.scss";
import useIsOwner from "@/lib/hooks/useIsOwner";
import DisplayedMedia from "./DisplayedMedia";
import MediaDetails from "./MediaDetails";
import useCanView from "@/lib/hooks/useCanView";
import { useTranslations } from "next-intl";
import FullScreenMedia from "./FullScreenMedia";
import NudeCardCreditAmount from "./NudeCardCreditAmount";
import BlurMedia from "./BlurMedia";

interface Props {
  currentNude: Nude;
  setCurrentNude: (e: any) => void;
}

const PrivateNudeCard: FC<Props> = ({ currentNude, setCurrentNude }) => {
  const isOwner = useIsOwner(currentNude.user._id);
  const canView = useCanView(currentNude);
  const t = useTranslations();
  const [openFullScreenModal, setOpenFullScreenModal] = useState(false);

  return (
    <>
      <div
        className={styles.container}
        style={{ cursor: "pointer" }}
        onClick={() => setOpenFullScreenModal(true)}
      >
        <MediaDetails medias={currentNude.medias} />

        <DisplayedMedia nude={currentNude} currentMediaIndex={0} type="card" />
        {!canView && !isOwner && <BlurMedia />}

        {!canView && isOwner && (
          <NudeCardCreditAmount
            creditAmount={currentNude.priceDetails.creditPrice / 100}
          />
        )}
      </div>
      <FullScreenMedia
        setOpen={setOpenFullScreenModal}
        open={openFullScreenModal}
        nude={currentNude}
        setCurrentNude={setCurrentNude}
      />
    </>
  );
};

export default PrivateNudeCard;
