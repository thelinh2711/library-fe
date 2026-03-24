import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

// layouts
import AdminLayout from "@/layouts/admin/AdminLayout.vue";

const routes = [
  { path: "/login", component: LoginView },

  // ADMIN (có sidebar)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { role: "ADMIN" },
    children: [
      {
        path: "",
        component: () => import("@/views/AdminView.vue"),
      },
      {
        path: "books",
        component: () => import("@/views/admin/Books.vue"),
      },
      {
        path: "categories",
        component: () => import("@/views/admin/Categories.vue"),
      },
      {
        path: "authors",
        component: () => import("@/views/admin/Authors.vue"),
      },
      {
        path: "students",
        component: () => import("@/views/admin/Students.vue"),
      },
    ],
  },

  // OTHER ROLE
  {
    path: "/librarian",
    component: () => import("@/views/LibrarianView.vue"),
    meta: { role: "LIBRARIAN" },
  },
  {
    path: "/member",
    component: () => import("@/views/MemberView.vue"),
    meta: { role: "MEMBER" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 GUARD (improve)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");

  // chưa login
  if (!token && to.path !== "/login") {
    return next("/login");
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // ⚠️ tuỳ BE: role hoặc scope
      const role = payload?.role || payload?.scope;

      // check role
      if (to.meta.role && to.meta.role !== role) {
        return next("/login");
      }
    } catch (e) {
      // token lỗi
      localStorage.removeItem("accessToken");
      return next("/login");
    }
  }

  next();
});

export default router;