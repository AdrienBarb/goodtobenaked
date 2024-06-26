import React, { FC, useEffect, useState } from "react";
import { Message } from "@/types/models/Message";
import useApi from "@/lib/hooks/useApi";
import NudeMediaSkeleton from "./LoadingSkeleton/NudeMediaSkeleton";
import NudeCard from "./NudeCard";
import styles from "@/styles/MessageNude.module.scss";

interface Props {
  nudeId: string;
}

const MessageNude: FC<Props> = ({ nudeId }) => {
  const [nude, setNude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchData } = useApi();

  const getNude = async () => {
    try {
      setIsLoading(true);
      const fetchedNude = await fetchData(`/api/nudes/${nudeId}`);
      setNude(fetchedNude);
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
      {isLoading || !nude ? (
        <NudeMediaSkeleton />
      ) : (
        <NudeCard nude={nude} display="card" />
      )}
    </div>
  );
};

export default MessageNude;
