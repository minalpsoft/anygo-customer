import apiClient from "./apiClient";

export const routeCheckApi = async payload => {
  const res = await apiClient.post('booking/route-check', payload);
  return res.data;
};

export const bookingEstimateApi = async payload => {
  const res = await apiClient.post('booking/estimate', payload);
  return res.data;
};
