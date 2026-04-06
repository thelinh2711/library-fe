import { defineStore } from "pinia";
import { loginApi, refreshApi, logoutApi } from "@/services/authService";
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

      const res = await refreshApi();

      const newAccessToken = res.data.result.accessToken;

      this.accessToken = newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    },

    redirectByRole(role) {
      if (role === "ADMIN") router.push("/admin");
      else if (role === "LIBRARIAN") router.push("/librarian");
      else router.push("/student");
    },

    async logout() {
  try {
    await logoutApi();
  } catch (err) {
    console.warn("Logout API lỗi:", err);           // 👈 log toàn bộ err
    console.warn("err.response:", err.response);
    console.warn("err.message:", err.message);
  } finally {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem("accessToken");
    router.push("/login");
  }
},
  },
});