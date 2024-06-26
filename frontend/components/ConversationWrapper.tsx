"use client";

import React, { FC, ReactNode } from "react";
import styles from "@/styles/ConversationWrapper.module.scss";
import UserAvatar from "./UserAvatar";
import { Link } from "@/navigation";
import ConversationUserMenu from "./ConversationUserMenu";
import { Conversation } from "@/types/models/Conversation";
import { User } from "@/types/models/User";

interface Props {
  conversation: Conversation;
  user?: User | null;
  setConversation: (e: Conversation) => void;
  children: ReactNode;
}

const ConversationWrapper: FC<Props> = ({
  user,
  children,
  conversation,
  setConversation,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <div className={styles.leftWrapper}>
          <div className={styles.userInfo}>
            {user && (
              <>
                <UserAvatar user={user} size={42} />
                <Link href={`/dashboard/community/${user._id}`} prefetch>
                  <div className={styles.pseudo}>{user.pseudo}</div>
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <ConversationUserMenu
            conversation={conversation}
            user={user}
            setConversation={setConversation}
          />
        )}
      </div>
      {children}
    </div>
  );
};

export default ConversationWrapper;
