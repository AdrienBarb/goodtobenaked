import React, { FC, useEffect, useState } from "react";
import useApi from "@/lib/hooks/useApi";
import NudeMediaSkeleton from "./LoadingSkeleton/NudeMediaSkeleton";
import styles from "@/styles/MessageNude.module.scss";
import PrivateNudeCard from "./PrivateNudeCard";

interface Props {
  nudeId: string;
}

const MessageNude: FC<Props> = ({ nudeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentNude, setCurrentNude] = useState(null);

  const { fetchData } = useApi();

  const getNude = async () => {
    try {
      setIsLoading(true);
      const fetchedNude = await fetchData(`/api/nudes/${nudeId}`);
      setCurrentNude(fetchedNude);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (nudeId) {
      getNude();
    }
  }, [nudeId]);

  return (
    <div className={styles.container}>
      {isLoading || !currentNude ? (
        <NudeMediaSkeleton />
      ) : currentNude ? (
        <PrivateNudeCard
          currentNude={currentNude}
          setCurrentNude={setCurrentNude}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MessageNude;
