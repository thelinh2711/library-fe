import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 👈 QUAN TRỌNG (để gửi cookie)
});

const PUBLIC_ROUTES = [
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
];

axiosClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    config.url?.includes(route)
  );

  if (authStore.accessToken && !isPublicRoute) {  // 👈
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>        // 👈 thêm
      originalRequest.url?.includes(route)
    );

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !isPublicRoute                                            // 👈 thêm
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await authStore.refreshTokenAction();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        authStore.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;