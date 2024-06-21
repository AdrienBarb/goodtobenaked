import axiosInstanceMultipartForm from "@/lib/axios/axiosMultipartConfig";
import axiosInstance from "../../lib/axios/axiosConfig";

const getUser = async (userId: string) => {
  const response = await axiosInstance.get(`/api/users/${userId}`);

  return response.data;
};

const userProfile = async (values: {}) => {
  const response = await axiosInstance.put(`/api/users/owner`, values);

  return response.data;
};

const getAccountOwner = async () => {
  const response = await axiosInstance.get(`/api/users/owner`);

  return response.data;
};

const getAllUsers = async (query: {} = {}) => {
  const response = await axiosInstance.get(`/api/users`, { params: query });

  return response.data;
};

const getCreditAmount = async () => {
  const response = await axiosInstance.get(`/api/users/refresh-credit`);

  return response.data;
};

const profileVisit = async (values: { userId: string }) => {
  const response = await axiosInstance.post(`/api/users/profile-visit`, values);

  return response.data;
};

const addProfilPicture = async (values: FormData) => {
  const response = await axiosInstanceMultipartForm.post(
    "/api/users/profil-picture",
    values
  );

  return response.data;
};

const addBannerPicture = async (values: FormData) => {
  const response = await axiosInstanceMultipartForm.post(
    "/api/users/profil-banner",
    values
  );

  return response.data;
};

const userService = {
  getUser,
  profileVisit,
  getAllUsers,
  getAccountOwner,
  userProfile,
  addProfilPicture,
  addBannerPicture,
  getCreditAmount,
};

export default userService;
