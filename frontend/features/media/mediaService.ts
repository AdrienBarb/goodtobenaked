import axiosInstance from "../../lib/axios/axiosConfig";

const generateUploadUrl = async (values: { filetype: string }) => {
  const response = await axiosInstance.post(
    `/api/medias/generate-upload-url`,
    values
  );

  return response.data;
};

const mediaService = {
  generateUploadUrl,
};

export default mediaService;
