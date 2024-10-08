"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "@/styles/SalesTable.module.scss";
import { useTranslations } from "next-intl";
import useApi from "@/lib/hooks/useApi";
import Text from "./Text";
import { Invoice } from "@/types/models/Invoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/lib/axios/axiosConfig";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

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
      refetchOnWindowFocus: false,
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

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <div className={styles.container}>
      {invoices.map((currentInvoice: Invoice, index) => {
        return (
          <div
            className={styles.saleCard}
            key={index}
            style={{
              backgroundColor: "#cecaff",
            }}
          >
            <div>
              <Text>{currentInvoice.title || currentInvoice._id}</Text>
            </div>
            <div className={styles.value}>
              {currentInvoice.paid ? (
                <div
                  className={styles.commandButton}
                  onClick={() => handleDownloadInvoices(currentInvoice?._id)}
                >
                  <FontAwesomeIcon icon={faDownload} color="white" />
                </div>
              ) : (
                <Text customStyles={{ color: "white" }}>
                  {t("incomes.waiting")}
                </Text>
              )}
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

export default InvoiceTable;
