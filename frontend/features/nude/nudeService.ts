import axiosInstance from "../../lib/axios/axiosConfig";

const getAllNudes = async (query: any) => {
  console.log("query ", query);

  const response = await axiosInstance.get("/api/nudes", {
    params: query,
  });

  return response.data;
};

const nudeService = {
  getAllNudes,
};

export default nudeService;
