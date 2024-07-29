"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/NudesExplore.module.scss";
import { Nude } from "@/types/models/Nude";
import NudeCard from "./NudeCard";
import useApi from "@/lib/hooks/useApi";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import NoResults from "./Common/NoResults";
import FilterSelect from "./FilterSelect";
import { TAGS, tagList } from "@/constants/constants";
import FiltersWrapper from "./FiltersWrapper";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

interface Props {
  initialNudesDatas: {
    nudes: Nude[];
    nextCursor: string;
  };
}

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const NudesExplore: FC<Props> = ({ initialNudesDatas }) => {
  const [filters, setFilters] = useState<{
    state: string | null;
    isFree: string | null;
    tag: string | null;
  }>({
    state: "",
    isFree: "",
    tag: "",
  });
  const t = useTranslations();
  const [globalLoading, setGlobalLoading] = useState(false);
  const queryKey = useMemo(() => ["exploreList", { filters }], [filters]);
  const [nudeList, setNudeList] = useState<Nude[]>(initialNudesDatas.nudes);

  const { data: session } = useSession();

  const { useInfinite } = useApi();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinite(
    queryKey,
    "/api/nudes",
    filters,
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

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage && !globalLoading,
  });

  const handleSelectStateChange = (
    value: { value: string; label: string } | null
  ) => {
    setGlobalLoading(true);
    setFilters({
      ...filters,
      state: value ? value.value : null,
    });
  };

  const handleSelectTypeChange = (
    value: { value: string; label: string } | null
  ) => {
    setGlobalLoading(true);
    setFilters({
      ...filters,
      isFree: value ? value.value : null,
    });
  };

  const handleSelectCategoryChange = (
    value: {
      value: string;
      label: string;
    } | null
  ) => {
    setGlobalLoading(true);
    setFilters({
      ...filters,
      tag: value ? value.value : null,
    });
  };

  return (
    <div className={styles.container}>
      <FiltersWrapper>
        <FilterSelect
          handleChange={handleSelectCategoryChange}
          placeholder={t("common.category")}
          options={tagList.map((currentTag) => {
            return {
              value: currentTag,
              label: t(`nudeCategories.${currentTag}`),
            };
          })}
        />
        <FilterSelect
          handleChange={handleSelectTypeChange}
          placeholder={"Payant ou gratuit"}
          options={[
            { value: "pays", label: t("common.pays") },
            { value: "free", label: t("common.free") },
          ]}
        />
        {session?.user?.id && (
          <FilterSelect
            handleChange={handleSelectStateChange}
            placeholder={"Status"}
            options={[{ value: "bought", label: t("common.paid") }]}
          />
        )}
      </FiltersWrapper>

      {globalLoading ? (
        <Loader style={{ color: "#cecaff" }} />
      ) : (
        <>
          {nudeList.length ? (
            <div className={styles.cardsList}>
              {nudeList.map((currentNude: Nude, index: number) => {
                return (
                  <NudeCard nude={currentNude} key={index} display="card" />
                );
              })}
            </div>
          ) : (
            <NoResults text={t("common.noPosts")} />
          )}

          <div
            style={{ height: "10rem", display: hasNextPage ? "flex" : "none" }}
            ref={loadMoreRef}
          >
            {isFetchingNextPage && <Loader style={{ color: "#cecaff" }} />}
          </div>
        </>
      )}
    </div>
  );
};

export default NudesExplore;
