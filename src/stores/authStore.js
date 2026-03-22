import { defineStore } from "pinia";
import { loginApi, refreshApi } from "@/services/authService";
import router from "@/router";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken"),
    user: null,
  }),

  actions: {
    async login(email, password) {
      const res = await loginApi({ email, password });

      // ✅ đúng format BE của bạn
      const accessToken = res.data.result.accessToken;

      this.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);

      // decode user
      const decoded = parseJwt(accessToken);
      this.user = decoded;

      this.redirectByRole(decoded?.role);
    },

    async refreshTokenAction() {
      console.log("📡 [REFRESH API] START");

      const res = await refreshApi();

      console.log("📥 [REFRESH API] RESPONSE:", res.data);

      const newAccessToken = res.data.result.accessToken;

      this.accessToken = newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      console.log("💾 TOKEN ĐÃ LƯU LOCALSTORAGE");
      return newAccessToken;
    },

    redirectByRole(role) {
      if (role === "ADMIN") router.push("/admin");
      else if (role === "LIBRARIAN") router.push("/librarian");
      else router.push("/member");
    },

    logout() {
      this.accessToken = null;
      this.user = null;

      localStorage.removeItem("accessToken");

      // gọi BE xoá cookie + redis
      fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // 👈 QUAN TRỌNG
      });

      router.push("/login");
    },
  },
});