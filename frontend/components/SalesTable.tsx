"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import styles from "@/styles/SalesTable.module.scss";
import NoResults from "@/components/Common/NoResults";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import Text from "./Text";
import { Sale } from "@/types/models/Sale";
import clsx from "clsx";
import TableRowSkeleton from "./LoadingSkeleton/TableRowSkeleton";
import dynamic from "next/dynamic";

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

      default:
        break;
    }

    return value;
  };

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

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
  }, [hasNextPage, fetchNextPage]);

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", backgroundColor: "#fff0eb" }}
    >
      <Table
        sx={{ minWidth: 500 }}
        size="small"
        aria-label="custom pagination table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Text weight="bolder">{t("incomes.amountLabel")}</Text>
            </TableCell>
            <TableCell sx={{}} align="left">
              <Text weight="bolder">{t("incomes.typeLabel")}</Text>
            </TableCell>
            <TableCell sx={{}} align="left">
              <Text weight="bolder">{t("incomes.userLabel")}</Text>
            </TableCell>
            <TableCell sx={{}} align="left">
              <Text weight="bolder">{t("incomes.dateLabel")}</Text>
            </TableCell>
            <TableCell sx={{}} align="left"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isFetching ? (
            <>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  colSpan={6}
                  sx={{
                    width: "100%",
                  }}
                >
                  <TableRowSkeleton />
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  colSpan={6}
                  sx={{
                    width: "100%",
                  }}
                >
                  <TableRowSkeleton />
                </TableCell>
              </TableRow>
            </>
          ) : sales.length > 0 ? (
            sales.map((currentSale: Sale, index: number) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  scope="row"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text>{`${currentSale.amount.baseValue / 100} €`}</Text>
                </TableCell>

                <TableCell
                  scope="row"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text>{getSaleType(currentSale.saleType)}</Text>
                </TableCell>

                <TableCell
                  scope="row"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text>
                    {currentSale.fromUser ? currentSale.fromUser?.pseudo : "-"}
                  </Text>
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text>
                    {format(new Date(currentSale?.createdAt), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </Text>
                </TableCell>
                <TableCell scope="row" align="right">
                  {currentSale?.isPaid ? (
                    <div className={clsx(styles.chip, styles.paid)}>
                      {t("incomes.paid")}
                    </div>
                  ) : (
                    <div className={clsx(styles.chip, styles.waiting)}>
                      {t("incomes.waiting")}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                colSpan={6}
                sx={{
                  width: "100%",
                }}
              >
                <NoResults text={t("incomes.noSales")} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div
        style={{ height: "10rem", display: "block", width: "100%" }}
        ref={loadMoreRef}
      >
        {isFetchingNextPage && <Loader />}
      </div>
    </TableContainer>
  );
};

export default SalesTable;
