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
  const [globalLoading, setGlobalLoading] = useState(true);
  const queryKey = useMemo(() => ["exploreList", { filters }], [filters]);
  const [nudeList, setNudeList] = useState<Nude[]>([]);

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
        <Loader />
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

export default NudesExplore;
