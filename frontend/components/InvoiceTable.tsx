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
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import Text from "./Text";
import clsx from "clsx";
import TableRowSkeleton from "./LoadingSkeleton/TableRowSkeleton";
import { Invoice } from "@/types/models/Invoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/lib/axios/axiosConfig";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const InvoiceTable = () => {
  //localstate
  const [invoices, setInvoices] = useState([]);
  const queryKey = useMemo(() => ["invoicesList", {}], []);

  //traduction
  const t = useTranslations();

  const { useInfinite } = useApi();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfinite(
    queryKey,
    "/api/incomes/invoices",
    {},
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
      initialData: {},
      onSuccess: (data: any) => {
        setInvoices(data?.pages.flatMap((page: any) => page.invoices));
      },
    }
  );

  const handleDownloadInvoices = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/incomes/invoices/${id}`, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the invoice:", error);
    }
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
              <Text weight="bolder">{t("incomes.invoice_number")}</Text>
            </TableCell>
            <TableCell sx={{}} align="left">
              <Text weight="bolder">{t("incomes.invoice_status")}</Text>
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
          ) : invoices.length > 0 ? (
            invoices.map((currentInvoice: Invoice, index: number) => (
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
                  <Text>{currentInvoice.title || currentInvoice._id}</Text>
                </TableCell>

                <TableCell
                  scope="row"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentInvoice?.paid ? (
                    <div className={clsx(styles.chip, styles.paid)}>
                      {t("incomes.paid")}
                    </div>
                  ) : (
                    <div className={clsx(styles.chip, styles.waiting)}>
                      {t("incomes.waiting")}
                    </div>
                  )}
                </TableCell>

                <TableCell scope="row" align="right">
                  {currentInvoice?.paid && (
                    <div
                      className={styles.commandButton}
                      onClick={() =>
                        handleDownloadInvoices(currentInvoice?._id)
                      }
                    >
                      <FontAwesomeIcon icon={faDownload} />
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
                <NoResults text={t("incomes.noInvoices")} />
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

export default InvoiceTable;
