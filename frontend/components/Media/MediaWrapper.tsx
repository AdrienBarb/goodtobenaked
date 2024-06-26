"use client";

import React, { FC, useEffect, useState } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/MediaWrapper.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import useCanView from "@/lib/hooks/useCanView";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import MediaDetails from "../MediaDetails";
import DisplayedMedia from "../DisplayedMedia";
import Navigation from "../Navigation";
import FullScreenMedia from "../FullScreenMedia";
import useRedirectToLoginPage from "@/lib/hooks/useRedirectToLoginPage";

interface Props {
  nude: Nude;
}

const MediaWrapper: FC<Props> = ({ nude }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentNude, setCurrentNude] = useState<Nude>(nude);
  const [openFullScreenModal, setOpenFullScreenModal] = useState(false);

  const { data: session, status } = useSession();

  //router
  const redirectToLoginPage = useRedirectToLoginPage();

  useEffect(() => {
    setCurrentMediaIndex(0);
    setCurrentNude(nude);
  }, [nude]);

  const handleMediaClick = () => {
    if (status === "unauthenticated") {
      redirectToLoginPage();
      return;
    }
    setOpenFullScreenModal(true);
  };

  const canView = useCanView(currentNude);

  return (
    <div>
      <div className={styles.container} onClick={handleMediaClick}>
        <MediaDetails medias={nude.medias} />
        <DisplayedMedia
          nude={currentNude}
          currentMediaIndex={currentMediaIndex}
          type="card"
        />
        {!canView && (
          <div className={styles.payIcon}>
            <FontAwesomeIcon
              icon={faSackDollar}
              fixedWidth
              color="white"
              size="lg"
            />
          </div>
        )}
        {canView && currentNude.medias.length > 1 && (
          <Navigation
            medias={currentNude.medias}
            setCurrentMediaIndex={setCurrentMediaIndex}
          />
        )}
      </div>
      <FullScreenMedia
        setOpen={setOpenFullScreenModal}
        open={openFullScreenModal}
        nude={currentNude}
        setCurrentNude={setCurrentNude}
      />
    </div>
  );
};

export default MediaWrapper;
