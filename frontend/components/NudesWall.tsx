"use client";

import React, { FC, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import NudeCard from "@/components/NudeCard";
import { Nude } from "@/types/models/Nude";

interface Props {
  nudes: Nude[];
  userId?: string;
}

const NudesWall: FC<Props> = ({ nudes }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);

  return (
    <div className={styles.container}>
      {nudeList.length > 0 && (
        <div className={styles.nudeCardList}>
          {nudeList.map((currentNude: Nude, index: number) => {
            return (
              <NudeCard
                nude={currentNude}
                key={index}
                showUserMenu={true}
                setNudeList={setNudeList}
                itemNumber={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NudesWall;
