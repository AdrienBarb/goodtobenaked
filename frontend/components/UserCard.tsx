"use client";

import React, { FC } from "react";
import styles from "@/styles/UserCard.module.scss";
import SimplePopover from "@/components/SimplePopover";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faCircle } from "@fortawesome/free-solid-svg-icons";
import S3Image from "./S3Image";
import { useTranslations } from "next-intl";
import { RootStateType } from "@/store/store";
import { SocketUser } from "@/types";
import { User } from "@/types/models/User";
import { Link } from "@/navigation";

interface Props {
  user: User;
}

const UserCard: FC<Props> = ({ user }) => {
  const t = useTranslations();
  const socketState = useSelector((state: RootStateType) => state.socket);

  return (
    <Link href={`/dashboard/community/${user._id}`} prefetch>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          {user.image?.profil && (
            <S3Image
              cloudfrontUrl={process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA}
              imageKey={user.image?.profil}
              imageAlt={`${user.pseudo} - profile picture`}
              fill={true}
              styles={{
                objectFit: "cover",
              }}
            />
          )}
          {socketState.onlineUsers.some(
            (u: SocketUser) => u?.userId === user?._id
          ) && (
            <div className={styles.iconContainer}>
              <SimplePopover description={t("common.online")}>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faCircle} color="#57cc99" size="sm" />
                </div>
              </SimplePopover>
            </div>
          )}
          {user.verified === "verified" && (
            <div className={styles.verifiedIconWrapper}>
              <SimplePopover description={t("common.verifiedProfile")}>
                <div className={styles.verifiedIcon}>
                  <FontAwesomeIcon
                    icon={faCertificate}
                    color="#cecaff"
                    size="sm"
                  />
                </div>
              </SimplePopover>
            </div>
          )}
        </div>
        <div className={styles.name}>{user.pseudo}</div>
      </div>
    </Link>
  );
};

export default UserCard;
