import axios from 'axios';
// import { API_BASE_URL } from '../services/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

import AsyncStorage from '@react-native-async-storage/async-storage';

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

// profile

export const getCustomerProfileApi = async (token) => {

  axios.get('http://10.0.2.2:3000/customer/profile', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
.then(res => console.log('PROFILE SUCCESS 👉', res.data))
.catch(err => console.log('PROFILE FAIL 👉', err.message));

  return res.data;
};

// ✅ UPDATE PROFILE
export const updateCustomerProfileApi = async (payload) => {
    const token = await AsyncStorage.getItem('token');

    const res = await axios.put(
        'http://10.0.2.2:3000/customer/profile/update',
        payload, // ✅ body
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return res.data;
};

export const getAddressFromLatLng = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    // console.log('🌍 GOOGLE GEO RESPONSE 👉', lat, lng, data.status);

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return 'Location not available';
  } catch (err) {
    // console.log('❌ GEO ERROR 👉', err.message);
    return 'Location not available';
  }
};