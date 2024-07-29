"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "@/styles/SalesTable.module.scss";
import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import Text from "./Text";
import { Sale } from "@/types/models/Sale";
import dynamic from "next/dynamic";
import { Link } from "@/navigation";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const SalesTable = () => {
  //localstate
  const [sales, setSales] = useState([]);
  const queryKey = useMemo(() => ["salesList", {}], []);

  //traduction
  const t = useTranslations();

  const { useInfinite } = useApi();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfinite(
    queryKey,
    "/api/incomes/sales",
    {},
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
      initialData: {},
      onSuccess: (data: any) => {
        setSales(data?.pages.flatMap((page: any) => page.sales));
      },
      refetchOnWindowFocus: false,
    }
  );

  const getSaleType = (saleType: string) => {
    let value = "-";

    switch (saleType) {
      case "nude":
        value = t("incomes.nudeSaleLabel");
        break;
      case "commission":
        value = t("incomes.commissionLabel");
        break;
      case "tip":
        value = t("incomes.tipsLabel");
        break;
      case "message":
        value = t("incomes.messageLabel");
        break;

      default:
        break;
    }

    return value;
  };

  const loadMoreRef = useRef(null);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const isAvailable = (availableDate: Date) => {
    return isBefore(new Date(availableDate), new Date());
  };

  return (
    <div className={styles.container}>
      {sales.map((currentSale: Sale, index) => {
        const available = isAvailable(currentSale.availableDate);

        return (
          <div
            className={styles.saleCard}
            key={index}
            style={{
              backgroundColor: currentSale.isPaid
                ? "rgba(0, 0, 0, 0.4)"
                : available
                ? "#cecaff"
                : "#f29d69",
            }}
          >
            <div>
              <Text
                weight="bolder"
                customStyles={{ color: "white", marginBottom: "0.2rem" }}
                fontSize={18}
              >
                {getSaleType(currentSale.saleType)}
              </Text>
              <div className={styles.nameAndDate}>
                {currentSale?.fromUser?._id && (
                  <Link
                    href={`/dashboard/community/${currentSale.fromUser._id}`}
                  >
                    {`${currentSale.fromUser.pseudo}`}
                  </Link>
                )}
                <Text customStyles={{ color: "white" }} fontSize={14}>
                  {`le ${format(
                    new Date(currentSale?.createdAt),
                    "dd MMMM yyyy",
                    {
                      locale: fr,
                    }
                  )}`}
                </Text>
              </div>
            </div>
            <div className={styles.value}>
              <Text
                weight="bolder"
                customStyles={{ color: "white" }}
                fontSize={20}
              >{`${currentSale.amount.fiatValue / 100} €`}</Text>
              <Text fontSize={12} customStyles={{ color: "white" }}>
                {currentSale.isPaid
                  ? t("incomes.paid")
                  : available
                  ? t("incomes.available")
                  : t("incomes.pending")}
              </Text>
            </div>
          </div>
        );
      })}

      <div
        style={{ height: "10rem", display: hasNextPage ? "flex" : "none" }}
        ref={loadMoreRef}
      >
        {isFetchingNextPage && <Loader style={{ color: "#cecaff" }} />}
      </div>
    </div>
  );
};

export default SalesTable;
