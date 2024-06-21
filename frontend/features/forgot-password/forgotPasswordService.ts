import axiosInstance from "../../lib/axios/axiosConfig";

const resetPasswordRequest = async (values: any) => {
  const response = await axiosInstance.post(
    "/api/users/password-request",
    values
  );

  return response.data;
};

const resetPassword = async (values: any) => {
  const response = await axiosInstance.post(
    "/api/users/password-reset",
    values
  );

  return response.data;
};

const forgotPasswordService = {
  resetPasswordRequest,
  resetPassword,
};

export default forgotPasswordService;
