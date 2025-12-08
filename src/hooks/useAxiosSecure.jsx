import axios from "axios";
import { useAuth } from "./useAuth";

const useAxiosSecure = () => {
  const token = localStorage.getItem("token");
  // Ensure that auth and user are defined before destructuring
  const access_token = token;

  const axiosSecure = axios.create({
    baseURL: import.meta.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  });

  axiosSecure.interceptors.request.use((config) => {
    if (access_token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${access_token}`,
      };
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;