"use client";

import React, { FC, useEffect, useRef, useState, useMemo } from "react";
import UserCard from "@/components/UserCard";
import styles from "@/styles/CardsList.module.scss";
import { User } from "@/types/models/User";
import useApi from "@/lib/hooks/useApi";
import FilterSelect from "./FilterSelect";
import { useTranslations } from "next-intl";
import { BODY_TYPE, HAIR_COLOR } from "@/constants/formValue";
import FiltersWrapper from "./FiltersWrapper";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

const ageFilters = ["18-22", "22-30", "30-40", "40+"];

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

interface Props {
  initialUsersDatas: {
    users: User[];
    nextCursor: string;
  };
}

export type UserFilters = {
  bodyType: string;
  hairColor: string;
  age: string;
};

const UsersList: FC<Props> = ({ initialUsersDatas }) => {
  const [filters, setFilters] = useState<UserFilters>({
    bodyType: "",
    hairColor: "",
    age: "",
  });
  const queryKey = useMemo(() => ["usersList", filters], [filters]);
  const t = useTranslations();
  const [usersList, setUsersList] = useState(initialUsersDatas.users);
  const [globalLoading, setGlobalLoading] = useState(false);

  const { useInfinite } = useApi();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinite(
    queryKey,
    "/api/users",
    filters,
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
      initialData: {
        pages: [
          {
            users: initialUsersDatas.users,
            nextCursor: initialUsersDatas.nextCursor,
          },
        ],
        pageParams: [null],
      },
      onSuccess: (data: any) => {
        setUsersList(data?.pages.flatMap((page: any) => page.users));
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

  const handleSelectBodyTypeChange = (
    value: {
      value: string;
      label: string;
    } | null
  ) => {
    setGlobalLoading(true);

    setFilters({
      ...filters,
      bodyType: value ? value.value : "",
    });
  };

  const handleSelectHairColorChange = (
    value: {
      value: string;
      label: string;
    } | null
  ) => {
    setGlobalLoading(true);

    setFilters({
      ...filters,
      hairColor: value ? value.value : "",
    });
  };

  const handleSelectAgeChange = (
    value: {
      value: string;
      label: string;
    } | null
  ) => {
    setGlobalLoading(true);

    setFilters({
      ...filters,
      age: value ? value.value : "",
    });
  };

  return (
    <div className={styles.container}>
      <FiltersWrapper>
        <FilterSelect
          handleChange={handleSelectBodyTypeChange}
          placeholder={t("db.body_type")}
          options={BODY_TYPE.map((el) => {
            return { value: el, label: t(`db.${el}`) };
          })}
        />
        <FilterSelect
          handleChange={handleSelectHairColorChange}
          placeholder={t("db.hair_color")}
          options={HAIR_COLOR.map((el) => {
            return { value: el, label: t(`db.${el}`) };
          })}
        />
        <FilterSelect
          handleChange={handleSelectAgeChange}
          placeholder={t("db.age")}
          options={ageFilters.map((el) => {
            return { value: el, label: el };
          })}
        />
      </FiltersWrapper>

      {globalLoading ? (
        <Loader style={{ color: "#cecaff" }} />
      ) : (
        <>
          <div className={styles.userList}>
            {usersList?.length &&
              usersList.map((currentUser, index) => {
                return <UserCard key={index} user={currentUser} />;
              })}
          </div>

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

export default UsersList;
