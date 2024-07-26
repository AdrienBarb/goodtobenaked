"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/ConversationList.module.scss";
import ConversationCard from "./ConversationCard";
import { useTranslations } from "next-intl";
import { Conversation } from "@/types/models/Conversation";
import { Link, useRouter } from "@/navigation";
import useApi from "@/lib/hooks/useApi";
import socket from "@/lib/socket/socket";
import AppMessage from "./AppMessage";
import ClassicButton from "./Buttons/ClassicButton";
import { useAppDispatch } from "@/store/store";
import { checkIfUnreadMessages } from "@/features/conversation/conversationSlice";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Loader from "./Loader";

interface Props {
  initialConversationsDatas: {
    conversations: Conversation[];
    nextCursor: string;
  };
}

const ConversationList: FC<Props> = ({ initialConversationsDatas }) => {
  //traduction
  const t = useTranslations();
  const [conversationsList, setConversationsList] = useState<Conversation[]>(
    initialConversationsDatas.conversations
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  const queryKey = useMemo(() => ["conversationsList", {}], []);

  const { useInfinite } = useApi();

  useEffect(() => {
    dispatch(checkIfUnreadMessages());
  }, []);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinite(
    queryKey,
    `/api/conversations`,
    {},
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
      initialData: {
        pages: [
          {
            conversations: initialConversationsDatas.conversations,
            nextCursor: initialConversationsDatas.nextCursor,
          },
        ],
        pageParams: [null],
      },
      onSuccess: (data: any) => {
        setConversationsList(
          data?.pages.flatMap((page: any) => page.conversations)
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

  useEffect(() => {
    if (!socket) return;

    socket?.on("getNotification", ({ conversationId }) => {
      setConversationsList([
        ...conversationsList.map((currentConversation) => {
          if (currentConversation._id === conversationId) {
            return {
              ...currentConversation,
              unreadMessage: true,
            };
          }

          return currentConversation;
        }),
      ]);
    });

    return () => {
      socket?.off("getNotification");
    };
  }, []);

  return (
    <div className={styles.container}>
      {conversationsList.length > 0 ? (
        <>
          {conversationsList.map(
            (currentConversation: Conversation, index: number) => {
              return (
                <Link
                  href={`/dashboard/account/messages/${currentConversation._id}`}
                  prefetch
                  key={index}
                >
                  <ConversationCard conversation={currentConversation} />
                </Link>
              );
            }
          )}
          <div
            style={{ height: "4rem", display: hasNextPage ? "flex" : "none" }}
            ref={loadMoreRef}
          >
            {isFetchingNextPage && <Loader style={{ color: "#cecaff" }} />}
          </div>
        </>
      ) : (
        <AppMessage
          title={t("error.no_conversations")}
          text={t("common.noConversationsHasBeenFound")}
        >
          <ClassicButton
            customStyles={{ width: "100%" }}
            onClick={() => router.push("/dashboard/community")}
          >
            {t("common.startToChat")}
          </ClassicButton>
        </AppMessage>
      )}
    </div>
  );
};

export default ConversationList;
