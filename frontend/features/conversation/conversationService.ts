import axiosInstance from "../../lib/axios/axiosConfig";

const getAllConversations = async () => {
  const response = await axiosInstance.get("/api/conversations");

  return response.data;
};

const getConversation = async (conversationId: string) => {
  const response = await axiosInstance.get(
    `/api/conversations/${conversationId}`
  );

  return response.data;
};

const checkIfUnreadMessages = async () => {
  const response = await axiosInstance.get(
    `/api/conversations/unread-messages`
  );

  return response.data;
};

const conversationService = {
  getAllConversations,
  getConversation,
  checkIfUnreadMessages,
};

export default conversationService;
