import { API_BASE_URL } from '../services/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// TEMP: hardcoded token (later replace with AsyncStorage)
apiClient.interceptors.request.use(config => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU3ZTk1NWYzMGViNmUxZGJmZjkzOTUiLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY3MzY5ODY3LCJleHAiOjE3Njc5NzQ2Njd9.ybcLTlW29PXJX3uMwxxaZzTng1OEG91_08qmg0om7aM';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;