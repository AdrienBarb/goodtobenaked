"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/CardsList.module.scss";
import { Nude } from "@/types/models/Nude";
import NudeCard from "./NudeCard";
import useApi from "@/lib/hooks/useApi";
import { useSession } from "next-auth/react";
import ActionTabsMenu from "./ActionTabsMenu";
import { useTranslations } from "next-intl";
import NoResults from "./Common/NoResults";
import dynamic from "next/dynamic";

interface Props {
  initialNudesDatas: {
    nudes: Nude[];
    nextCursor: string;
  };
}

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const NudesFeed: FC<Props> = ({ initialNudesDatas }) => {
  //localstate
  const [showOnlyFollowedUser, setShowOnlyFollowedUser] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [nudeList, setNudeList] = useState<Nude[]>([]);

  //traduction
  const t = useTranslations();

  const queryKey = useMemo(
    () => ["feedList", { showOnlyFollowedUser }],
    [showOnlyFollowedUser]
  );

  const { data: session } = useSession();

  const { useInfinite } = useApi();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfinite(
      queryKey,
      "/api/nudes",
      { showOnlyFollowedUser },
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
          console.log("data ", data);

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

  const handleChangeList = (value: boolean) => {
    setGlobalLoading(true);
    setShowOnlyFollowedUser(value);
  };

  const totalNudes = nudeList.length;

  return (
    <div className={styles.container}>
      {session?.user?.id && (
        <ActionTabsMenu
          tabs={[
            {
              label: t("common.all"),
              action: () => handleChangeList(false),
            },
            {
              label: t("common.follow"),
              action: () => handleChangeList(true),
            },
          ]}
        />
      )}

      {globalLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.feedList}>
            {nudeList.length ? (
              nudeList.map((currentNude: Nude, index: number) => {
                const cardClass =
                  index < totalNudes - 1 ? styles.cardWithBorder : "";

                return (
                  <div className={cardClass} key={index}>
                    <NudeCard nude={currentNude} key={index} display="post" />
                  </div>
                );
              })
            ) : (
              <NoResults text={t("common.noPosts")} />
            )}
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

export default NudesFeed;
