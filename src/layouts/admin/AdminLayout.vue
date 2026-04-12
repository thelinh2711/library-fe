<!-- src/layouts/admin/AdminLayout.vue -->
<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f5f7]" style="font-family: 'DM Sans', sans-serif;">

    <!-- ── Sidebar ───────────────────────────────────────────── -->
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
      <nav class="flex flex-1 flex-col overflow-y-auto px-3 py-4">

        <!-- Danh mục -->
        <p class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Danh mục</p>
        <div class="flex flex-col gap-0.5 mb-5">
          <router-link
            v-for="item in catalogItems"
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
        </div>

        <!-- Mượn trả -->
        <p class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Mượn trả</p>
        <div class="flex flex-col gap-0.5">
          <router-link
            v-for="item in borrowItems"
            :key="item.to"
            :to="item.to"
            class="nav-item group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-white/40 transition-all duration-150 hover:bg-white/5 hover:text-white/80"
            active-class="nav-item--active"
          >
            <span class="nav-icon flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.05] transition-all duration-150">
              <component :is="item.icon" class="h-[14px] w-[14px]" />
            </span>
            <span class="flex-1">{{ item.label }}</span>
            <!-- Badge số lượng pending (nếu có) -->
            <span
              v-if="item.badge && item.badge.value > 0"
              class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-500/80 px-1 text-[10px] font-semibold text-white"
            >
              {{ item.badge.value }}
            </span>
          </router-link>
        </div>
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

    <!-- ── Main ──────────────────────────────────────────────── -->
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
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  LogOut, LayoutDashboard, BookOpen, Tag, Users,
  GraduationCap, BookMarked, ClipboardList, ReceiptText,
} from "lucide-vue-next";
import { getReservations } from "@/services/reservationService";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const route  = useRoute();
const authStore = useAuthStore();

// ✅ khai báo base trước khi dùng
const base = computed(() =>
  authStore.isLibrarian ? "/librarian" : "/admin"
);

const pendingCount = ref(0);

onMounted(async () => {
  try {
    const res = await getReservations({ status: "PENDING", page: 0, size: 1 });
    pendingCount.value = res.data.result.totalElements ?? 0;
  } catch {}
});

const catalogItems = computed(() => [
  { to: base.value,              label: "Dashboard", icon: LayoutDashboard },
  { to: `${base.value}/books`,      label: "Sách",      icon: BookOpen        },
  { to: `${base.value}/categories`, label: "Thể loại",  icon: Tag             },
  { to: `${base.value}/authors`,    label: "Tác giả",   icon: Users           },
  { to: `${base.value}/students`,   label: "Sinh viên", icon: GraduationCap   },
]);

const borrowItems = computed(() => [
  {
    to: `${base.value}/reservations`,
    label: "Đặt trước",
    icon: BookMarked,
    badge: pendingCount,
  },
  { to: `${base.value}/borrows`, label: "Mượn sách",  icon: ClipboardList },
  { to: `${base.value}/fines`,   label: "Phiếu phạt", icon: ReceiptText   },
]);

// ✅ allItems phải là computed, dùng .value khi spread
const allItems = computed(() => [...catalogItems.value, ...borrowItems.value]);

const currentTitle = computed(() => {
  const match =
    allItems.value.find((i) => i.to !== base.value && route.path.startsWith(i.to)) ??
    allItems.value.find((i) => route.path === i.to);
  return match?.label ?? "Dashboard";
});

const logout = () => authStore.logout();
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