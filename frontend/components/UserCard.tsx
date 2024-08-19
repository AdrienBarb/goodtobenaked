"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/UserCard.module.scss";
import SimplePopover from "@/components/SimplePopover";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faCircle } from "@fortawesome/free-solid-svg-icons";
import S3Image from "./S3Image";
import { useTranslations } from "next-intl";
import { RootStateType } from "@/store/store";
import { User } from "@/types/models/User";
import { Link } from "@/navigation";
import Text from "./Text";

interface Props {
  user: User;
  index: number;
}

const UserCard: FC<Props> = ({ user, index = 0 }) => {
  const t = useTranslations();
  const socketState = useSelector((state: RootStateType) => state.socket);

  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);

  const images = user.secondaryProfileImages || [];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isHovered && images.length > 0) {
      setCurrentImageIndex(0);

      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex !== null ? (prevIndex + 1) % images.length : 0
        );
      }, 1000);
    } else {
      setCurrentImageIndex(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, images.length]);

  return (
    <Link
      href={`/dashboard/community/${user._id}`}
      prefetch
      data-id={`user-card-${index}`}
    >
      <div
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageWrapper}>
          {currentImageIndex !== null && images.length > 0 ? (
            <S3Image
              imageKey={images[currentImageIndex]?.convertedKey}
              imageAlt={`${user.pseudo} - profile picture`}
              fill={true}
              styles={{
                objectFit: "cover",
              }}
            />
          ) : (
            user.profileImage && (
              <S3Image
                imageKey={user?.profileImage}
                imageAlt={`${user.pseudo} - profile picture`}
                fill={true}
                styles={{
                  objectFit: "cover",
                }}
              />
            )
          )}
          {socketState.onlineUsers.some(
            (u: any) => u?.userId === user?._id
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
        <Text customStyles={{ marginTop: "0.2rem" }}>{user.pseudo}</Text>
      </div>
    </Link>
  );
};

export default UserCard;
