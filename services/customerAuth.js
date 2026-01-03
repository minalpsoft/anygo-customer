import axios from 'axios';
import { API_BASE_URL } from '../services/api';

export const customerLoginApi = async (payload) => {
  try {
    console.log('LOGIN PAYLOAD 👉', payload);

    const res = await axios.post(
      `${API_BASE_URL}auth/login`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 👈 important
      }
    );

    console.log('LOGIN RESPONSE 👉', res.data);
    return res.data;

  } catch (error) {
    console.log('AXIOS RAW ERROR 👉', error);
    throw error;
  }
};


export const customerRegisterApi = async (payload) => {
  const res = await fetch(`${API_BASE_URL}customer/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};



export const verifyOtpApi = async (payload) => {
  const res = await fetch(`${API_BASE_URL}auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};


// bookings

export const routeCheckApi = async (payload, token) => {
  const res = await axios.post(
    `${API_BASE_URL}booking/route-check`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const bookingEstimateApi = async (payload, token) => {
  const res = await axios.post(
    `${API_BASE_URL}booking/estimate`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


