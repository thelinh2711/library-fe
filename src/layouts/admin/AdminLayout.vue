<!-- src/layouts/admin/AdminLayout.vue -->
<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f5f7]" style="font-family: 'DM Sans', sans-serif;">

    <!-- ── Sidebar (fixed) ──────────────────────────────────── -->
    <aside class="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-[#0f1117] border-r border-white/[0.06]">

      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-5 py-6 border-b border-white/[0.06]">
        <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span class="text-sm font-semibold tracking-tight text-white">LibraryAdmin</span>
      </div>

      <!-- Nav -->
      <nav class="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        <p class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Menu</p>

        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-white/40 transition-all duration-150 hover:bg-white/5 hover:text-white/80"
          active-class="nav-item--active"
        >
          <span class="nav-icon flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.05] transition-all duration-150">
            <component :is="item.icon" class="h-[14px] w-[14px]" />
          </span>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="border-t border-white/[0.06] px-3 py-4">
        <button
          @click="logout"
          class="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-white/35 transition-all duration-150 hover:bg-red-500/[0.08] hover:text-red-400"
        >
          <span class="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-red-500/[0.08]">
            <LogOut class="h-[14px] w-[14px] text-red-400" />
          </span>
          Đăng xuất
        </button>
      </div>
    </aside>

    <!-- ── Main (offset sidebar) ────────────────────────────── -->
    <div class="ml-60 flex flex-1 flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-black/[0.06] bg-[#f5f5f7]/85 px-8 backdrop-blur-md">
        <span class="text-xs font-semibold tracking-wide text-slate-400">{{ currentTitle }}</span>
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-semibold text-white">
          A
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-8">
        <router-view />
      </main>
    </div>

  </div>
</template>

<script setup>
import { computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LogOut } from "lucide-vue-next";

const router = useRouter();
const route  = useRoute();

const IconDashboard = () =>
  h("svg", { fill: "none", stroke: "currentColor", "stroke-width": "2", viewBox: "0 0 24 24" }, [
    h("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
    h("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
    h("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
    h("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" }),
  ]);

const IconBook = () =>
  h("svg", { fill: "none", stroke: "currentColor", "stroke-width": "2", viewBox: "0 0 24 24" }, [
    h("path", { d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }),
  ]);

const IconTag = () =>
  h("svg", { fill: "none", stroke: "currentColor", "stroke-width": "2", viewBox: "0 0 24 24" }, [
    h("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" }),
    h("line", { x1: "7", y1: "7", x2: "7.01", y2: "7" }),
  ]);

const IconUser = () =>
  h("svg", { fill: "none", stroke: "currentColor", "stroke-width": "2", viewBox: "0 0 24 24" }, [
    h("path", { d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" }),
    h("circle", { cx: "9", cy: "7", r: "4" }),
    h("path", { d: "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" }),
  ]);

const navItems = [
  { to: "/admin",            label: "Dashboard", icon: IconDashboard },
  { to: "/admin/books",      label: "Sách",       icon: IconBook      },
  { to: "/admin/categories", label: "Thể loại",   icon: IconTag       },
  { to: "/admin/authors",    label: "Tác giả",    icon: IconUser      },
];

const currentTitle = computed(() => {
  const match =
    navItems.find((i) => i.to !== "/admin" && route.path.startsWith(i.to)) ??
    navItems.find((i) => route.path === i.to);
  return match?.label ?? "Dashboard";
});

const logout = () => {
  localStorage.removeItem("accessToken");
  router.push("/login");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

.nav-item--active {
  background-color: rgba(99, 102, 241, 0.15);
  color: #ffffff;
}
.nav-item--active .nav-icon {
  background: linear-gradient(to bottom right, #6366f1, #7c3aed);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
</style>