import axiosInstance from "../../lib/axios/axiosConfig";

const getGenderCategories = async () => {
  const response = await axiosInstance.get(`/api/categories/genders`);

  return response.data;
};

const categoryService = {
  getGenderCategories,
};

export default categoryService;
