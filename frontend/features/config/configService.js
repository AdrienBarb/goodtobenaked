import axiosInstance from '../../lib/axios/axiosConfig';

const getAppConfigurations = async () => {
  const response = await axiosInstance.get('/api/config');

  return response.data;
};

const checkIsMaintenance = async () => {
  const response = await axiosInstance.get('/api/config/is-maintenance');

  return response.data;
};

const configService = {
  getAppConfigurations,
  checkIsMaintenance,
};

export default configService;
