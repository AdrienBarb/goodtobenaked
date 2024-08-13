"use client";

import React, { FC } from "react";
import { Nude } from "@/types/models/Nude";
import styles from "@/styles/NudeCard.module.scss";
import NudeCardUserMenu from "./NudeCardUserMenu";
import useIsOwner from "@/lib/hooks/useIsOwner";
import DisplayedMedia from "./DisplayedMedia";
import MediaDetails from "./MediaDetails";
import useCanView from "@/lib/hooks/useCanView";
import Image from "next/image";
import Text from "./Text";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/navigation";
import { useParams } from "next/navigation";

interface Props {
  nude: Nude;
  showUserMenu?: boolean;
  setNudeList?: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
}

const NudeCard: FC<Props> = ({ nude, showUserMenu, setNudeList }) => {
  const isOwner = useIsOwner(nude.user._id);
  const canView = useCanView(nude);
  const t = useTranslations();
  const { userId } = useParams();

  return (
    <div className={styles.container}>
      {showUserMenu && isOwner && (
        <div className={styles.userMenuWrapper}>
          <NudeCardUserMenu nude={nude} setNudeList={setNudeList} />
        </div>
      )}
      <MediaDetails medias={nude.medias} />
      <Link href={`/dashboard/community/gallery/${userId}`}>
        <DisplayedMedia nude={nude} currentMediaIndex={0} type="card" />
        {!canView && !isOwner && (
          <div className={styles.blurWrapper}>
            <div className={styles.payIcon}>
              <Image
                src={"/images/svg/white.svg"}
                alt="logo"
                fill={true}
                objectFit="contain"
              />
            </div>
            <Text
              weight="thiner"
              textAlign="center"
              customStyles={{ color: "white" }}
              fontSize={12}
            >
              {t("common.wantToSeeMore")}
            </Text>
          </div>
        )}

        {!canView && isOwner && (
          <div className={styles.paidIcon}>
            <FontAwesomeIcon
              icon={faSackDollar}
              fixedWidth
              color="white"
              size="sm"
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default NudeCard;
