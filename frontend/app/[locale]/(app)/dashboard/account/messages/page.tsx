import ConversationList from "@/components/ConversationList";
import ScrollableContainer from "@/components/ScrollableContainer";
import conversationService from "@/features/conversation/conversationService";
import React from "react";

const MessagesPage = async () => {
  const initialConversationsDatas =
    await conversationService.getAllConversations();

  return (
    <ScrollableContainer>
      <ConversationList initialConversationsDatas={initialConversationsDatas} />
    </ScrollableContainer>
  );
};

export default MessagesPage;
