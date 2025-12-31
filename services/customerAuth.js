import axios from 'axios';

const API_BASE_URL = 'http://192.168.31.89:3000/';

export const customerLoginApi = async (payload) => {
  const res = await axios.post(
    `${API_BASE_URL}auth/login`,
    payload
  );
  return res.data;
};

export const customerRegisterApi = async (payload) => {
  const res = await axios.post(
    `${API_BASE_URL}customer/register`,
    payload
  );
  return res.data;
};