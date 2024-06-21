"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import NudeCard from "@/components/NudeCard";
import { Nude } from "@/types/models/Nude";
import useApi from "@/lib/hooks/useApi";
import Title from "./Title";
import dynamic from "next/dynamic";

interface Props {
  initialNudesDatas: {
    nudes: Nude[];
    nextCursor: string;
  };
  userId?: string;
}

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const NudesWall: FC<Props> = ({ initialNudesDatas, userId }) => {
  //localstate
  const [nudeList, setNudeList] = useState<Nude[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  const queryKey = useMemo(() => ["feedList", { userId }], [userId]);
  const { useInfinite } = useApi();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinite(
    queryKey,
    "/api/nudes",
    { userId },
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
      initialData: {
        pages: [
          {
            nudes: initialNudesDatas.nudes,
            nextCursor: initialNudesDatas.nextCursor,
          },
        ],
        pageParams: [null],
      },
      onSuccess: (data: any) => {
        setNudeList(data?.pages.flatMap((page: any) => page.nudes));
        setGlobalLoading(false);
      },
      refetchOnWindowFocus: false,
    }
  );

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (nudeList.length === 0 || !hasNextPage || globalLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage, nudeList.length, globalLoading]);

  return (
    <div className={styles.container}>
      {nudeList.length > 0 && (
        <>
          <Title Tag="h4" customStyles={{ marginBottom: "1rem" }}>
            Nudes
          </Title>

          <div className={styles.nudeCardList}>
            {nudeList.map((currentNude: Nude, index: number) => {
              return (
                <NudeCard
                  nude={currentNude}
                  key={index}
                  display="card"
                  showUserMenu={true}
                  setNudeList={setNudeList}
                />
              );
            })}
          </div>

          <div
            style={{ height: "10rem", display: "block", width: "100%" }}
            ref={loadMoreRef}
          >
            {isFetchingNextPage && <Loader />}
          </div>
        </>
      )}
    </div>
  );
};

export default NudesWall;
