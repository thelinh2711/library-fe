import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

const routes = [
  { path: "/login", component: LoginView },

  {
    path: "/admin",
    component: () => import("@/views/AdminView.vue"),
    meta: { role: "ADMIN" },
  },
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

// guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");

  if (!token && to.path !== "/login") {
    return next("/login");
  }

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload?.role;

    if (to.meta.role && to.meta.role !== role) {
      return next("/login");
    }
  }

  next();
});

export default router;