import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER } from '../config';

const api = axios.create({ baseURL: `${SERVER}/api` });

// attach saved token to every request
api.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;