"use client";

import React, { FC } from "react";
import styles from "@/styles/CardsList.module.scss";
import { Nude } from "@/types/models/Nude";
import NoResults from "./Common/NoResults";
import { useTranslations } from "next-intl";
import NudePost from "./NudePost";

interface Props {
  nudeList: Nude[];
  setNudeList: (nudes: Nude[] | ((prevNudes: Nude[]) => Nude[])) => void;
}

const NudesFeedList: FC<Props> = ({ nudeList, setNudeList }) => {
  //traduction
  const t = useTranslations();

  return (
    <div className={styles.feedList}>
      {nudeList.length ? (
        nudeList.map((currentNude: Nude, index: number) => {
          return (
            <div key={index}>
              <NudePost
                nude={currentNude}
                setNudeList={setNudeList}
                key={index}
                itemNumber={index}
              />
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
