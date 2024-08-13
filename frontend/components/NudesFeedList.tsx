"use client";

import React, { FC } from "react";
import styles from "@/styles/CardsList.module.scss";
import { Nude } from "@/types/models/Nude";
import NudeCard from "./NudeCard";
import NoResults from "./Common/NoResults";
import { useTranslations } from "next-intl";
import NudePost from "./NudePost";

interface Props {
  nudeList: Nude[];
}

const NudesFeedList: FC<Props> = ({ nudeList }) => {
  //traduction
  const t = useTranslations();

  const totalNudes = nudeList.length;

  return (
    <div className={styles.feedList}>
      {nudeList.length ? (
        nudeList.map((currentNude: Nude, index: number) => {
          const cardClass = index < totalNudes - 1 ? styles.cardWithBorder : "";

          return (
            <div className={cardClass} key={index}>
              <NudePost nude={currentNude} key={index} />
            </div>
          );
        })
      ) : (
        <NoResults text={t("common.noPosts")} />
      )}
    </div>
  );
};

export default NudesFeedList;
