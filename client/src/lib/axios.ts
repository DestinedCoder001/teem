import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    const res = err.response;

    // checking for expired access token here
    const isExpiredToken =
      res?.status === 401 && res?.data?.message === "Invalid token";

    if (isExpiredToken && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("access_token", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;