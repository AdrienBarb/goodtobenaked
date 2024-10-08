"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/NotificationsList.module.scss";
import useApi from "@/lib/hooks/useApi";
import { Notification } from "@/types/models/NotificationModel";
import NotificationCard from "./NotificationCard";
import { useAppDispatch } from "@/store/store";
import { setUnreadNotifications } from "@/features/notification/notificationSlice";
import { USER_INAPP_NOTIFICATION } from "@/constants/constants";
import { useTranslations } from "next-intl";
import FiltersWrapper from "./FiltersWrapper";
import FilterSelect from "./FilterSelect";
import AppMessage from "./AppMessage";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

interface Props {
  initialNotificationsData: {
    notifications: Notification[];
    nextCursor: string;
  };
}

const NotificationsList: FC<Props> = ({ initialNotificationsData }) => {
  const [notificationsList, setNotificationsList] = useState(
    initialNotificationsData.notifications
  );

  const [notificationFilters, setNotificationFilters] = useState<string>("");
  const queryKey = useMemo(
    () => ["notificationList", { notificationFilters }],
    [notificationFilters]
  );
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const { useInfinite, usePut } = useApi();

  const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
    useInfinite(
      queryKey,
      "/api/notifications",
      { notificationType: notificationFilters },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
        initialData: {
          pages: [
            {
              notifications: initialNotificationsData.notifications,
              nextCursor: initialNotificationsData.nextCursor,
            },
          ],
          pageParams: [null],
        },
        onSuccess: (data: any) => {
          setNotificationsList(
            data?.pages.flatMap((page: any) => page.notifications)
          );
        },
        refetchOnWindowFocus: false,
      }
    );

  const loadMoreRef = useRef(null);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const { mutate: markNotificationsAsRead, isLoading } = usePut(
    `/api/notifications/mark-as-read`,
    {
      onSuccess: () => {
        refetch();
        dispatch(setUnreadNotifications(false));
      },
    }
  );

  useEffect(() => {
    markNotificationsAsRead({});
  }, []);

  const handleNotificationChange = (
    value: {
      value: string;
      label: string;
    } | null
  ) => {
    setNotificationFilters(value ? value.value : "");
  };

  if (notificationsList.length === 0) {
    return (
      <AppMessage
        title={t("error.noNotifications")}
        text={t("common.noNotificationFound")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <FiltersWrapper>
        <FilterSelect
          handleChange={handleNotificationChange}
          placeholder={t("notification.labelFilter")}
          options={USER_INAPP_NOTIFICATION.map((el) => {
            return { value: el, label: t(`notification.${el}`) };
          })}
        />
      </FiltersWrapper>

      <ul className={styles.list}>
        {notificationsList.map((currentNotification, index) => {
          return (
            <NotificationCard key={index} notification={currentNotification} />
          );
        })}
      </ul>

      <div
        style={{ height: "4rem", display: hasNextPage ? "flex" : "none" }}
        ref={loadMoreRef}
      >
        {isFetchingNextPage && <Loader style={{ color: "#cecaff" }} />}
      </div>
    </div>
  );
};

export default NotificationsList;
