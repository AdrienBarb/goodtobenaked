"use client";

import React, { FC, useState } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudePost.module.scss";
import NudeUserDetails from "./NudeUserDetails";
import useIsOwner from "@/lib/hooks/useIsOwner";
import DisplayedMedia from "./DisplayedMedia";
import BuyMediaButton from "./Buttons/BuyMediaButton";
import Navigation from "./Navigation";
import useCanView from "@/lib/hooks/useCanView";
import MediaDetails from "./MediaDetails";
interface Props {
  nude: Nude;
  setNudeList: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
  itemNumber: number;
}

const NudePost: FC<Props> = ({ nude, setNudeList, itemNumber }) => {
  const isOwner = useIsOwner(nude.user._id);
  const canView = useCanView(nude);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  return (
    <div className={styles.container} id={`item-${nude._id}`}>
      <div className={styles.userDetailsWrapper}>
        <NudeUserDetails nude={nude} showAvatar />
      </div>

      <div className={styles.mediaContainer}>
        <DisplayedMedia
          nude={nude}
          currentMediaIndex={currentMediaIndex}
          type="fullScreen"
        />
        {!canView && !isOwner && (
          <BuyMediaButton
            nude={nude}
            callback={(updatedNude) => {
              setNudeList((previousNudeList) => {
                return previousNudeList.map((oldNude) => {
                  if (oldNude._id === updatedNude._id) {
                    return updatedNude;
                  }

                  return oldNude;
                });
              });
            }}
          />
        )}
        {(canView || isOwner) && nude.medias.length > 1 && (
          <Navigation
            medias={nude.medias}
            setCurrentMediaIndex={setCurrentMediaIndex}
          />
        )}
        <MediaDetails medias={nude.medias} />
      </div>
    </div>
  );
};

export default NudePost;
