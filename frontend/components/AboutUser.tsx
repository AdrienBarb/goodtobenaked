"use client";

import React, { FC } from "react";
import styles from "@/styles/AboutUser.module.scss";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";
import { MdWeb } from "react-icons/md";
import { useTranslations } from "next-intl";
import { User } from "@/types/models/User";
import useApi from "@/lib/hooks/useApi";
import { useParams } from "next/navigation";

interface Props {
  initialUserDatas: User;
}

const AboutUser: FC<Props> = ({ initialUserDatas }) => {
  const t = useTranslations();
  const { userId } = useParams<{ userId: string }>();
  const { useGet } = useApi();

  const { data: currentUser } = useGet(
    `/api/users/${userId}`,
    {},
    {
      initialData: initialUserDatas,
    }
  );

  const IS_SOCIAL = Boolean(
    currentUser.socialMediaLink?.twitter ||
      currentUser.socialMediaLink?.instagram ||
      currentUser.socialMediaLink?.mym ||
      currentUser.socialMediaLink?.onlyfans
  );

  const IS_DETAILS = Boolean(
    currentUser.age ||
      currentUser.gender ||
      currentUser.breastSize ||
      currentUser.buttSize ||
      currentUser.bodyType ||
      currentUser.hairColor
  );

  return (
    <div className={styles.container}>
      {IS_SOCIAL && (
        <div>
          <h2>{t("profile.social")}</h2>
          <div>
            <div>
              {currentUser.socialMediaLink?.twitter && (
                <div className={styles.linkWrapper}>
                  <AiOutlineTwitter size={26} color="#cecaff" />

                  <a
                    href={currentUser.socialMediaLink?.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                </div>
              )}
              {currentUser.socialMediaLink?.instagram && (
                <div className={styles.linkWrapper}>
                  <AiFillInstagram size={26} color="#cecaff" />
                  <a
                    href={currentUser.socialMediaLink?.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              )}
              {currentUser.socialMediaLink?.mym && (
                <div className={styles.linkWrapper}>
                  <MdWeb size={26} color="#cecaff" />
                  <a
                    href={currentUser.socialMediaLink?.mym}
                    target="_blank"
                    rel="noreferrer"
                  >
                    MYM
                  </a>
                </div>
              )}
              {currentUser.socialMediaLink?.onlyfans && (
                <div className={styles.linkWrapper}>
                  <MdWeb size={26} color="#cecaff" />
                  <a
                    href={currentUser.socialMediaLink?.onlyfans}
                    target="_blank"
                    rel="noreferrer"
                  >
                    OnlyFans
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {IS_DETAILS && (
        <div>
          <h2>{t("profile.details")}</h2>
          {currentUser.age && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.age")} :</span>
              <span>{currentUser.age}</span>
            </div>
          )}
          {currentUser.gender && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.gender")} :</span>
              <span>{t(`db.${currentUser.gender?.name}`)}</span>
            </div>
          )}
          {currentUser.breastSize && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.breast_size")} :</span>
              <span>{t(`db.${currentUser.breastSize}`)}</span>
            </div>
          )}
          {currentUser.buttSize && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.butt_size")} :</span>
              <span>{t(`db.${currentUser.buttSize}`)}</span>
            </div>
          )}
          {currentUser.bodyType && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.body_type")} :</span>
              <span>{t(`db.${currentUser.bodyType}`)}</span>
            </div>
          )}
          {currentUser.hairColor && (
            <div className={styles.detailsWrapper}>
              <span>{t("db.hair_color")} :</span>
              <span>{t(`db.${currentUser.hairColor}`)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutUser;
