"use client";

import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import NudeCard from "@/components/NudeCard";
import { Nude } from "@/types/models/Nude";
import useApi from "@/lib/hooks/useApi";
import { useParams } from "next/navigation";
import IconButton from "./Buttons/IconButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import UserNudesFilters from "./UserNudesFilters";
import { TagsList } from "@/types";

interface Props {
  nudes: Nude[];
  initialAvailableTags: TagsList[];
  userId?: string;
}

const NudesWall: FC<Props> = ({ nudes, initialAvailableTags }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>(nudes);
  const [tagsList, setTagsList] = useState<TagsList[]>(initialAvailableTags);
  const [filters, setFilters] = useState({
    tag: "",
  });
  const { userId } = useParams();

  const { fetchData } = useApi();

  const getNudes = async () => {
    try {
      const { nudes, availableTags } = await fetchData(
        `/api/nudes/user/${userId}`,
        filters
      );

      setNudeList(nudes);
      setTagsList(availableTags);
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
          tagsList={tagsList}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
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
    </div>
  );
};

export default NudesWall;
