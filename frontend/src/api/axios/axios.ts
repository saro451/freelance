import axios from 'axios';
import { getCookie } from 'cookies-next';


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
  // ? process.env.NEXT_PUBLIC_DEV_SWEDEN
  ? process.env.NEXT_PUBLIC_DEV_BASE_URL
  : "/api/v1",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Accept-Language": getCookie('selectedLanguage'),
    "Token": getCookie("token"),
  },
});

export default axiosInstance;
