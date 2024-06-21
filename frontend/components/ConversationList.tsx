"use client";

import React, { FC, useEffect, useState } from "react";
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

interface Props {
  initialConversationsDatas: Conversation[];
}

const ConversationList: FC<Props> = ({ initialConversationsDatas }) => {
  //traduction
  const t = useTranslations();
  const [conversationsList, setConversationsList] = useState<Conversation[]>(
    initialConversationsDatas
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { fetchData } = useApi();

  useEffect(() => {
    dispatch(checkIfUnreadMessages());
  }, []);

  const getConversations = async () => {
    const r = await fetchData("/api/conversations");

    setConversationsList(r);
  };

  useEffect(() => {
    getConversations();
  }, []);

  console.log("conversationsList ", conversationsList);

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
        conversationsList.map(
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
        )
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
