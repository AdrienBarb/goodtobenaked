import axiosInstance from "../../lib/axios/axiosConfig";


// Get all creators
const getCreators = async (query) => {

  const response = await axiosInstance.get(
    `/api/admin/creators`,
    {
      params: query,
      headers: {
        'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY,
      },
    }
  );

  return response.data;
};

// Get current creator identity check
const getCurrentCreatorIdentityCheck = async (values) => {

  const response = await axiosInstance.get(
    `/api/admin/creators/${values.creatorId}`,
    {
      headers: {
        'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY,
      },
    }
  );

  return response.data;
};

// Change verif state
const changeVerificationState = async (values) => {

  const response = await axiosInstance.put(
    `/api/admin/creators/${values.creatorId}/change-verification-state`,
    values,
    {
      headers: {
        'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY,
      },
    }
  );

  return response.data;
};

// Get all conflict
const getConflicts = async (query) => {

  const response = await axiosInstance.get(
    `/api/admin/conflicts`,
    {
      params: query,
      headers: {
        'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY,
      },
    }
  );

  return response.data;
};

const adminService = {
  getCreators,
  getCurrentCreatorIdentityCheck,
  changeVerificationState,
  getConflicts
};

export default adminService;
