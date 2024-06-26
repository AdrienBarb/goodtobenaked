"use client";

import React, { useState, useEffect, FC } from "react";
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

interface Props {
  initialConversationDatas: Conversation;
}

const CurrentConversation: FC<Props> = ({ initialConversationDatas }) => {
  //localstate
  const [messagesList, setMessagesList] = useState<Message[]>(
    initialConversationDatas.messages
  );
  const [conversation, setConversation] = useState(initialConversationDatas);

  const { otherUser } = useConversationUsers(
    initialConversationDatas.participants
  );

  //router
  const { conversationId } = useParams();

  //others
  const ref = useChatScroll(messagesList);

  const { useGet } = useApi();

  const { data } = useGet(
    `/api/conversations/${conversationId}`,
    {},
    {
      initialData: initialConversationDatas,
      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        setConversation(data);
        setMessagesList(data.messages);
      },
    }
  );

  useEffect(() => {
    if (!socket) return;

    socket?.off("getMessage")?.on("getMessage", (data) => {
      if (data && data.message && data.message._id) {
        setMessagesList((prev) => [...prev, data.message]);
      }
    });
  }, []);

  return (
    <ConversationWrapper
      user={otherUser}
      conversation={conversation}
      setConversation={setConversation}
    >
      <div className={styles.chatBoxTop} ref={ref}>
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
