import { defineStore } from "pinia";
import { loginApi, refreshApi, logoutApi } from "@/services/authService";
import router from "@/router";

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    // Khôi phục role từ token khi F5
    const token = localStorage.getItem("accessToken");
    const decoded = parseJwt(token);
    return {
      accessToken: token,
      user: decoded,
      role: decoded?.role || null,   // ⬅️ khởi tạo ngay từ token
    };
  },

  getters: {
    isAdmin:     (state) => state.role === "ADMIN",
    isLibrarian: (state) => state.role === "LIBRARIAN",
    canDelete:   (state) => state.role === "ADMIN",
  },

  actions: {
    async login(email, password) {
      const res = await loginApi({ email, password });
      const accessToken = res.data.result.accessToken;

      const decoded = parseJwt(accessToken);

      this.accessToken = accessToken;
      this.user = decoded;
      this.role = decoded?.role || null;   // ⬅️ set role
      localStorage.setItem("accessToken", accessToken);

      this.redirectByRole(this.role);
    },

    async refreshTokenAction() {
      const res = await refreshApi();
      const newAccessToken = res.data.result.accessToken;

      const decoded = parseJwt(newAccessToken);

      this.accessToken = newAccessToken;
      this.user = decoded;
      this.role = decoded?.role || null;   // ⬅️ cập nhật role sau refresh
      localStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    },

    redirectByRole(role) {
      if (role === "ADMIN")         router.push("/admin/books");
      else if (role === "LIBRARIAN") router.push("/librarian/books");
      else                           router.push("/student");
    },

    async logout() {
      try {
        await logoutApi();
      } catch (err) {
        console.warn("Logout API lỗi:", err);
      } finally {
        this.accessToken = null;
        this.user = null;
        this.role = null;            // ⬅️ clear role
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    },
  },
});