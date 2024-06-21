import React, { FC } from "react";
import styles from "@/styles/ConversationCard.module.scss";

import { Conversation } from "@/types/models/Conversation";
import { useSession } from "next-auth/react";
import ConversationSkeleton from "./LoadingSkeleton/ConversationSkeleton";
import useConversationUsers from "@/lib/hooks/useConversationUsers";
import useIsUserOnline from "@/lib/hooks/useIsUserOnline";

interface Props {
  conversation: Conversation;
}

const ConversationCard: FC<Props> = ({ conversation }) => {
  const { data: session } = useSession();
  const { otherUser } = useConversationUsers(conversation.participantDetails);
  const isOnline = useIsUserOnline(otherUser?._id);

  if (!session || !otherUser) {
    return <ConversationSkeleton />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div
          className={styles.image}
          style={{
            ...(otherUser?.image?.profil && {
              backgroundImage: `url(${
                process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA +
                otherUser.image.profil
              })`,
            }),
          }}
        >
          {isOnline && <span className={styles.onlineBadge}></span>}
        </div>
        <div className={styles.name}>{otherUser?.pseudo}</div>
      </div>
      {conversation.unreadMessage && (
        <span className={styles.newMessage}></span>
      )}
    </div>
  );
};

export default ConversationCard;
