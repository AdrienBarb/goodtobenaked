"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import NudeCard from "@/components/NudeCard";
import { Nude } from "@/types/models/Nude";
import useApi from "@/lib/hooks/useApi";
import { useParams } from "next/navigation";
import UserNudesFilters from "./UserNudesFilters";
import { AvailableFilters, NudeFilters } from "@/types";
import { useTranslations } from "next-intl";

interface Props {
  nudes: Nude[];
  initialAvailableFilters: AvailableFilters;
  userId?: string;
}

const NudesWall: FC<Props> = ({ nudes, initialAvailableFilters }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);
  const [currentAvailableFilters, setCurrentAvailableFilters] = useState(
    initialAvailableFilters
  );
  const t = useTranslations();
  const [filters, setFilters] = useState<NudeFilters>({
    tag: "",
    isFree: null,
    mediaTypes: null,
  });
  const { userId } = useParams();

  const { fetchData } = useApi();

  const getNudes = async () => {
    try {
      const { nudes, availableFilters } = await fetchData(
        `/api/nudes/user/${userId}`,
        filters
      );

      setNudeList(nudes);
      setCurrentAvailableFilters(availableFilters);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getNudes();
    }
  }, [userId, filters]);

  return (
    <div>
      <div className="mb-4">
        <UserNudesFilters
          availableFilters={currentAvailableFilters}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
      <div className={styles.container}>
        {nudeList.length > 0 ? (
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
        ) : (
          <div className="w-full font-karla font-light text-center mt-16">
            {t("common.NoNudeFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default NudesWall;
