import React, { useEffect, FC } from "react";
import styles from "@/styles/Message.module.scss";
import moment from "moment";
import TimeAgo from "javascript-time-ago";
import fr from "javascript-time-ago/locale/fr";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Message } from "@/types/models/Message";
import useConversationUsers from "@/lib/hooks/useConversationUsers";
import useApi from "@/lib/hooks/useApi";
import MessageNude from "./MessageNude";
import { Conversation } from "@/types/models/Conversation";

//Config timeago in french
TimeAgo.addDefaultLocale(fr);

interface Props {
  message: Message;
  index: number;
  conversation: Conversation;
}

const UserMessage: FC<Props> = ({ message, index, conversation }) => {
  const { currentUser } = useConversationUsers(conversation.participants);

  //others
  const timeAgo = new TimeAgo("fr-FR");
  const dateObject = moment(message?.createdAt).toDate();
  const timeAgoValue = timeAgo.format(dateObject);
  const { usePut } = useApi();

  const { mutate: markMessageAsRead } = usePut(
    `/api/conversations/mark-as-read`,
    {}
  );

  useEffect(() => {
    if (
      !message.seen &&
      currentUser?._id &&
      message.sender !== currentUser?._id
    ) {
      markMessageAsRead({ messageId: message._id });
    }
  }, [currentUser]);

  return (
    <div
      key={index}
      className={styles.container}
      style={{
        alignSelf: message?.sender === currentUser?._id ? "end" : "start",
        backgroundColor:
          message?.sender === currentUser?._id ? "#Cecaff" : "#68738B",
      }}
    >
      <div className={styles.menuWrapper}></div>
      <div className={styles.content}>
        {message?.text && <div className={styles.message}>{message?.text}</div>}
        {message.nude && <MessageNude nudeId={message.nude} />}
      </div>
      <div className={styles.bottomMessage}>
        <div className={styles.hour}>{timeAgoValue}</div>
        {message?.sender === currentUser?._id && (
          <>
            {message.seen ? (
              <DoneAllIcon fontSize="small" sx={{ color: "white" }} />
            ) : (
              <DoneIcon fontSize="small" sx={{ color: "white" }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
