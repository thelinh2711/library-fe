import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

// layouts
import AdminLayout from "@/layouts/admin/AdminLayout.vue";

const routes = [
  { path: "/login", component: LoginView },
  {
    path: '/auth/callback',
    component: () => import('@/views/AuthCallback.vue'),
  },

  // ADMIN (có sidebar)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { role: "ADMIN" },
    children: [
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
      {
        path: "reservations",
        name: "Reservations",
        component: () => import("@/views/admin/Reservations.vue"),
      },
      {
        path: "borrows",
        name: "Borrows",
        component: () => import("@/views/admin/Borrows.vue"),
      },
      {
        path: "fines",
        name: "Fines",
        component: () => import("@/views/admin/Fines.vue"),
      },
    ],
  },

  // OTHER ROLE
  {
    path: "/librarian",
    component: AdminLayout,
    meta: { role: "LIBRARIAN" },
    children: [
      { path: "books",        component: () => import("@/views/admin/Books.vue") },
      { path: "categories",   component: () => import("@/views/admin/Categories.vue") },
      { path: "authors",      component: () => import("@/views/admin/Authors.vue") },
      { path: "students",     component: () => import("@/views/admin/Students.vue") },
      { path: "reservations", component: () => import("@/views/admin/Reservations.vue") },
      { path: "borrows",      component: () => import("@/views/admin/Borrows.vue") },
      { path: "fines",        component: () => import("@/views/admin/Fines.vue") },
    ],
  },
  {
    path: "/student",
    component: () => import("@/layouts/student/StudentLayout.vue"),
    meta: { role: "STUDENT" },
    children: [
      {
        path: "",
        name: "student-books",
        component: () => import("@/views/student/BooksView.vue"),
      },
      {
        path: "reservations",
        name: "student-reservations",
        component: () => import("@/views/student/ReservationsView.vue"),
      },
       {
        path: "borrowings",
        name: "student-borrowings",
        component: () => import("@/views/student/MyBorrowings.vue"),
      },
      { 
        path: "profile",     
        name: "student-profile",      
        component: () => import("@/views/student/StudentProfile.vue") 
      },
    ],
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
  if (!token && to.path !== "/login" && to.path !== "/auth/callback") {
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