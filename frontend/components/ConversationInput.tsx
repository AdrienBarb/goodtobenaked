"use client";

import React, { useState, FC } from "react";
import styles from "@/styles/ConversationInput.module.scss";
import CustomTextField from "@/components/Inputs/TextField";
import FullButton from "@/components/Buttons/FullButton";
import { useSelector } from "react-redux";
import { RootStateType } from "@/store/store";
import { useTranslations } from "next-intl";
import useConversationUsers from "@/lib/hooks/useConversationUsers";
import { useParams } from "next/navigation";
import IconButton from "./Buttons/IconButton";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import useHaveBeenBlocked from "@/lib/hooks/useHaveBeenBlocked";
import useApi from "@/lib/hooks/useApi";
import socket from "@/lib/socket/socket";
import { Message } from "@/types/models/Message";
import { Conversation } from "@/types/models/Conversation";
import useUserVerified from "@/lib/hooks/useUserVerified";
import { useRouter } from "@/navigation";
import PrivateNudeModal from "./PrivateNudeModal";
import { useSession } from "next-auth/react";

interface Props {
  conversation: Conversation;
  setMessagesList: (
    updateFunction: (previousMessages: Message[]) => Message[]
  ) => void;
}

const ConversationInput: FC<Props> = ({ conversation, setMessagesList }) => {
  //localstate
  const [message, setMessage] = useState("");
  const [openNudeModal, setOpenNudeModal] = useState(false);

  //hooks
  const haveBeenBlocked: boolean = useHaveBeenBlocked(conversation);
  const { otherUser, currentUser } = useConversationUsers(
    conversation.participants
  );
  const { usePost } = useApi();
  const isUserVerified = useUserVerified();

  //redux
  const socketState = useSelector((state: RootStateType) => state.socket);

  //router
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();

  const { data: session } = useSession();

  //traduction
  const t = useTranslations();

  const { mutate: sendMessage, isLoading } = usePost(
    `/api/conversations/${conversationId}/messages`,
    {
      onSuccess: (data) => {
        setMessagesList((previousMessages: Message[]) => [
          ...previousMessages,
          data,
        ]);

        if (
          socketState.onlineUsers.some((user) => user.userId === otherUser?._id)
        ) {
          socket?.emit("sendMessage", {
            senderId: currentUser?._id,
            receiverId: otherUser?._id,
            message: data,
          });

          socket?.emit("sendNotification", {
            receiverId: otherUser?._id,
            conversationId: conversationId,
          });
        }
      },
    }
  );

  const handleSendMessage = () => {
    if (!message) {
      return;
    }

    setMessage("");

    sendMessage({
      text: message,
    });
  };

  const handleMediaProposition = () => {
    if (!isUserVerified) {
      router.push("/dashboard/account/verification");
      return;
    }

    setOpenNudeModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputsWrapper}>
        <CustomTextField
          fullWidth
          id="message"
          label={t("conversation.message")}
          placeholder={t("conversation.writeMessage")}
          multiline
          disabled={haveBeenBlocked}
          variant="filled"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className={styles.buttonWrapper}>
        {session?.user?.isAccountVerified && (
          <IconButton
            icon={faImage}
            onClick={handleMediaProposition}
            disabled={haveBeenBlocked}
            style={{
              height: "46px",
              width: "46px",
            }}
          />
        )}
        <FullButton
          isLoading={isLoading}
          onClick={handleSendMessage}
          customStyles={{
            width: "100%",
            height: "46px",
          }}
          disabled={!message || haveBeenBlocked}
        >
          {t("conversation.send")}
        </FullButton>
      </div>
      <PrivateNudeModal
        open={openNudeModal}
        setOpen={setOpenNudeModal}
        setMessagesList={setMessagesList}
        conversation={conversation}
      />
    </div>
  );
};

export default ConversationInput;
