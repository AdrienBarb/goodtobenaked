"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import NudeCard from "@/components/NudeCard";
import { Nude } from "@/types/models/Nude";
import useApi from "@/lib/hooks/useApi";
import { useParams } from "next/navigation";

interface Props {
  nudes: Nude[];
  userId?: string;
}

const NudesWall: FC<Props> = ({ nudes }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);
  const { userId } = useParams();

  const { fetchData } = useApi();

  const getNudes = async () => {
    try {
      const r = await fetchData(`/api/nudes/user/${userId}`);

      setNudeList(r);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getNudes();
    }
  }, [userId]);

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
