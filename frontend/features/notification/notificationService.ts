import axiosInstance from "../../lib/axios/axiosConfig";

const getNotifications = async (query?: {
  cursor: string | null;
  notificationType: string[];
}) => {
  const response = await axiosInstance.get(`/api/notifications`, {
    params: query,
  });

  return response.data;
};

const getUnreadNotificationsCount = async () => {
  const response = await axiosInstance.get(
    `/api/notifications/unread-count`,
    {}
  );

  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadNotificationsCount,
};

export default notificationService;
