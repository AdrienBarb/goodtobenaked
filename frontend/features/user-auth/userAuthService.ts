import axiosInstance from "../../lib/axios/axiosConfig";

const register = async (values: any) => {
  const response = await axiosInstance.post("/api/users", values);

  return response.data;
};

const login = async (values: any) => {
  const response = await axiosInstance.post("/api/users/login", values);

  return response.data;
};

const userAuthService = {
  register,
  login,
};

export default userAuthService;
