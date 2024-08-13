"use client";

import React, { FC, useState } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudePost.module.scss";
import NudeCardUserMenu from "./NudeCardUserMenu";
import NudeUserDetails from "./NudeUserDetails";
import useIsOwner from "@/lib/hooks/useIsOwner";
import MediaWrapper from "./Media/MediaWrapper";
import DisplayedMedia from "./DisplayedMedia";
import BuyMediaButton from "./Buttons/BuyMediaButton";
import Navigation from "./Navigation";
import useCanView from "@/lib/hooks/useCanView";
import MediaDetails from "./MediaDetails";
import { useSession } from "next-auth/react";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";
import FullScreenMedia from "./FullScreenMedia";

interface Props {
  nude: Nude;
  setNudeList?: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
}

const NudePost: FC<Props> = ({ nude }) => {
  const isOwner = useIsOwner(nude.user._id);
  const canView = useCanView(nude);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentNude, setCurrentNude] = useState<Nude>(nude);

  console.log("currentNude ", currentNude);
  console.log(canView);

  return (
    <div className={styles.container}>
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
          <BuyMediaButton nude={nude} setCurrentNude={setCurrentNude} />
        )}
        {(canView || isOwner) && currentNude.medias.length > 1 && (
          <Navigation
            medias={currentNude.medias}
            setCurrentMediaIndex={setCurrentMediaIndex}
          />
        )}
        <MediaDetails medias={currentNude.medias} />
      </div>
    </div>
  );
};

export default NudePost;
