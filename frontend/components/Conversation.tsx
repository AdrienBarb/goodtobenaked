"use client";

import React, { useState, useEffect, FC, useMemo, useRef } from "react";
import styles from "@/styles/Conversation.module.scss";
import { useChatScroll } from "@/lib/hooks/useChatScroll";
import useConversationUsers from "@/lib/hooks/useConversationUsers";
import { useParams } from "next/navigation";
import ConversationInput from "./ConversationInput";
import ConversationWrapper from "./ConversationWrapper";
import useApi from "@/lib/hooks/useApi";
import socket from "@/lib/socket/socket";
import { Message } from "@/types/models/Message";
import { Conversation } from "@/types/models/Conversation";
import UserMessage from "./Message";
import Loader from "./Loader";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

interface Props {
  initialConversationDatas: Conversation;
  initialMessagesDatas: {
    messages: Message[];
    nextCursor: string;
  };
}

const CurrentConversation: FC<Props> = ({
  initialConversationDatas,
  initialMessagesDatas,
}) => {
  //localstate
  const [messagesList, setMessagesList] = useState<Message[]>(
    initialMessagesDatas.messages
  );
  const [conversation, setConversation] = useState(initialConversationDatas);

  const { otherUser } = useConversationUsers(
    initialConversationDatas.participants
  );

  //router
  const { conversationId } = useParams();

  //others
  const ref = useChatScroll(messagesList);
  const queryKey = useMemo(
    () => ["messageList", { conversationId }],
    [conversationId]
  );

  const { fetchData, useInfinite } = useApi();

  const getConversation = async () => {
    try {
      const fetchedConversation = await fetchData(
        `/api/conversations/${conversationId}`
      );
      setConversation(fetchedConversation);
    } catch (error) {
      console.log(error);
    }
  };

  const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
    useInfinite(
      queryKey,
      `/api/conversations/${conversationId}/messages`,
      {},
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
        initialData: {
          pages: [
            {
              messages: initialMessagesDatas.messages,
              nextCursor: initialMessagesDatas.nextCursor,
            },
          ],
          pageParams: [null],
        },
        onSuccess: (data: any) => {
          setMessagesList(data?.pages.flatMap((page: any) => page.messages));
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
    if (conversationId) {
      getConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    socket?.off("getMessage")?.on("getMessage", (data) => {
      if (data && data.message && data.message._id) {
        setMessagesList((prev) => [...prev, data.message]);
      }
    });
  }, []);

  console.log("messagesList ", messagesList);

  console.log("hasNextPage ", hasNextPage);

  return (
    <ConversationWrapper
      user={otherUser}
      conversation={conversation}
      setConversation={setConversation}
    >
      <div className={styles.chatBoxTop} ref={ref}>
        <div
          style={{ height: "2rem", display: hasNextPage ? "block" : "none" }}
          ref={loadMoreRef}
        >
          {isFetchingNextPage && <Loader />}
        </div>
        {messagesList.map((currentMessage, index) => {
          return (
            <UserMessage
              key={index}
              message={currentMessage}
              conversation={conversation}
              index={index}
            />
          );
        })}
      </div>
      <ConversationInput
        conversation={conversation}
        setMessagesList={setMessagesList}
      />
    </ConversationWrapper>
  );
};

export default CurrentConversation;
