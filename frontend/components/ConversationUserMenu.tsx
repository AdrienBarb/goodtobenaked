import React, { FC } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import DotMenuContainer from "./Common/Menu/DotMenuContainer";
import MenuElement from "./Common/Menu/MenuElement";
import useApi from "@/lib/hooks/useApi";
import { Conversation } from "@/types/models/Conversation";
import { User } from "@/types/models/User";

interface Props {
  conversation: Conversation;
  user: User;
  setConversation: (e: Conversation) => void;
}

const ConversationUserMenu: FC<Props> = ({
  conversation,
  user,
  setConversation,
}) => {
  //router
  const { conversationId } = useParams();

  //traduction
  const t = useTranslations();

  const { usePut } = useApi();
  const { mutate: manageBlockUser } = usePut(
    `/api/conversations/${conversationId}/block`,
    {
      onSuccess: (data) => {
        setConversation({
          ...conversation,
          blockedUsers: data,
        });
      },
    }
  );

  const handleMemberBlocking = () => {
    manageBlockUser({ userId: user._id });
  };

  return (
    <DotMenuContainer>
      <MenuElement onClick={handleMemberBlocking}>
        {conversation.blockedUsers?.includes(user._id)
          ? t("common.unlock")
          : t("common.lock")}
      </MenuElement>
    </DotMenuContainer>
  );
};

export default ConversationUserMenu;
