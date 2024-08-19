import axiosInstance from "../../lib/axios/axiosConfig";

const getAllNudes = async (query: any) => {
  const response = await axiosInstance.get("/api/nudes", {
    params: query,
  });

  return response.data;
};

const getUserNudes = async (userId: string) => {
  const response = await axiosInstance.get(`/api/nudes/user/${userId}`);

  return response.data;
};

const nudeService = {
  getAllNudes,
  getUserNudes,
};

export default nudeService;
