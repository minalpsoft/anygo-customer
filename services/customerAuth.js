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
  const res = await axios.get(
    `${API_BASE_URL}customer/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


// ✅ UPDATE PROFILE
export const updateCustomerProfileApi = async (payload) => {
  const token = await AsyncStorage.getItem('token');

  const res = await axios.put(
    `${API_BASE_URL}customer/profile/update`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
};


const getAddressFromLatLng = async (lat, lng) => {
  if (lat == null || lng == null) {
    return 'Location unavailable';
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const data = await res.json();

    if (data.results?.length > 0) {
      return data.results[0].formatted_address;
    }

    return 'Address not found';
  } catch (error) {
    console.log('GEOCODE ERROR', error);
    return 'Address not available';
  }
};

export const deleteCustomerAccountApi = async () => {
  const token = await AsyncStorage.getItem('token');

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const res = await fetch(`${API_BASE_URL}customer/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete account');
  }

  return data;
};