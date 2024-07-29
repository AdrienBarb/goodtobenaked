import BackButton from "@/components/Common/BackButton";
import Conversation from "@/components/Conversation";
import ScrollableContainer from "@/components/ScrollableContainer";
import conversationService from "@/features/conversation/conversationService";
import React from "react";

const CurrentConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const { conversationId } = params;

  const initialConversationDatas = await conversationService.getConversation(
    conversationId
  );

  const initialMessagesDatas =
    await conversationService.getConversationMessages(conversationId);

  return (
    <ScrollableContainer>
      <BackButton prevPath={`/dashboard/account/messages`} />
      <Conversation
        initialConversationDatas={initialConversationDatas}
        initialMessagesDatas={initialMessagesDatas}
      />
    </ScrollableContainer>
  );
};

export default CurrentConversationPage;
