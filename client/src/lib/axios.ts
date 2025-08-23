import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const res = err.response;

    const isExpired =
      res?.status === 401 && res?.data?.message === "Invalid token";

    if (isExpired && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        useAuthStore.getState().setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().setAccessToken(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
