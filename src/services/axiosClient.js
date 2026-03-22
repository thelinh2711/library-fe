import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 👈 QUAN TRỌNG (để gửi cookie)
});

axiosClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  console.log("➡️ REQUEST:", config.url);
  console.log("🔑 ACCESS TOKEN HIỆN TẠI:", authStore.accessToken);

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("⚠️ TOKEN HẾT HẠN → CALL REFRESH");
      originalRequest._retry = true;

      try {
        console.log("📡 ĐANG GỌI REFRESH API...");
        const newToken = await authStore.refreshTokenAction();

        console.log("✅ REFRESH THÀNH CÔNG");
        console.log("🆕 TOKEN MỚI:", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log("🔁 GỬI LẠI REQUEST:", originalRequest.url);
        return axiosClient(originalRequest);
      } catch (err) {
        console.log("💥 REFRESH FAIL → LOGOUT");
        authStore.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;