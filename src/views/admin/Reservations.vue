<!-- src/views/admin/Reservations.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 tracking-tight">Đặt trước sách</h1>
        <p class="text-xs text-slate-400 mt-0.5">Quản lý yêu cầu đặt trước từ sinh viên</p>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="store.setAdminStatus(tab.value)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
          :class="store.adminStatus === tab.value
            ? 'bg-white text-slate-700 shadow-sm'
            : 'text-slate-400 hover:text-slate-600'"
        >
          {{ tab.label }}
          <span
            v-if="store.adminStatus === tab.value && store.adminTotalElements > 0"
            class="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold bg-indigo-100 text-indigo-600"
          >
            {{ store.adminTotalElements }}
          </span>
        </button>
      </div>
    </div>

    <!-- Card bảng -->
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">

      <!-- Empty -->
      <div
        v-if="!store.adminLoading && store.adminReservations.length === 0"
        class="flex flex-col items-center gap-2 py-16 text-slate-400"
      >
        <BookMarked class="w-10 h-10 opacity-30" />
        <p class="text-sm font-semibold text-slate-500">Không có đặt trước nào</p>
        <p class="text-xs">{{ emptyMessage }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th :class="TH">Sinh viên</th>
              <th :class="TH">Sách</th>
              <th :class="TH">Ngày đặt</th>
              <th :class="TH">Hết hạn giữ</th>
              <th :class="TH">Trạng thái</th>
              <th :class="[TH, 'text-right']">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton -->
            <template v-if="store.adminLoading">
              <tr v-for="i in 5" :key="i" class="border-b border-slate-50">
                <td v-for="j in 6" :key="j" class="px-4 py-3.5">
                  <div
                    class="h-3.5 rounded bg-slate-100 animate-pulse"
                    :style="{ width: j === 1 ? '70%' : '55%' }"
                  />
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <template v-else>
              <tr
                v-for="r in store.adminReservations"
                :key="r.id"
                class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <!-- Sinh viên -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold">
                      {{ initials(r.studentName) }}
                    </div>
                    <span class="font-medium text-slate-700">{{ r.studentName }}</span>
                  </div>
                </td>

                <!-- Sách -->
                <td class="px-4 py-3.5">
                  <span class="font-medium text-slate-700 line-clamp-1 max-w-[200px]">
                    {{ r.bookTitle }}
                  </span>
                </td>

                <!-- Ngày đặt -->
                <td class="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                  {{ formatDate(r.reservedAt) }}
                </td>

                <!-- Hết hạn giữ -->
                <td class="px-4 py-3.5 text-xs whitespace-nowrap">
                  <span
                    v-if="r.expiredAt"
                    :class="isExpiringSoon(r.expiredAt)
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-500'"
                  >
                    {{ formatDate(r.expiredAt) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Trạng thái -->
                <td class="px-4 py-3.5">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    :class="statusClass[r.status]"
                  >
                    {{ statusLabel[r.status] ?? r.status }}
                  </span>
                </td>

                <!-- Thao tác -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="r.status === 'PENDING'"
                      :disabled="store.adminActionLoading === r.id"
                      @click="store.confirmAdmin(r.id)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Check class="w-3 h-3" /> Duyệt
                    </button>

                    <button
                      v-if="r.status === 'PENDING' || r.status === 'CONFIRMED'"
                      :disabled="store.adminActionLoading === r.id"
                      @click="handleCancel(r.id)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <X class="w-3 h-3" /> Huỷ
                    </button>

                    <span
                      v-if="r.status === 'CANCELLED' || r.status === 'EXPIRED'"
                      class="text-xs text-slate-300"
                    >—</span>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="!store.adminLoading && store.adminReservations.length > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-slate-100"
      >
        <p class="text-xs text-slate-400">
          Trang <span class="font-semibold text-slate-600">{{ store.adminPage + 1 }}</span> /
          <span class="font-semibold text-slate-600">{{ store.adminTotalPages || 1 }}</span>
        </p>
        <div class="flex items-center gap-1.5">
          <button
            :disabled="store.adminPage === 0"
            @click="store.setAdminPage(store.adminPage - 1)"
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            :disabled="store.adminPage + 1 >= store.adminTotalPages"
            @click="store.setAdminPage(store.adminPage + 1)"
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { BookMarked, Check, X, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useReservationStore } from "@/stores/reservationStore";

const store = useReservationStore();

const TH = "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap";

const tabs = [
  { label: "Chờ duyệt",        value: "PENDING"   },
  { label: "Đã xác nhận",      value: "CONFIRMED" },
  { label: "Đã huỷ / Hết hạn", value: "CLOSED"    },
];

const statusClass = {
  PENDING:   "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-slate-100 text-slate-400",
  EXPIRED:   "bg-rose-50 text-rose-400",
};

const statusLabel = {
  PENDING:   "Chờ duyệt",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  EXPIRED:   "Hết hạn",
};

const emptyMessage = computed(() => ({
  PENDING:   "Không có yêu cầu nào đang chờ duyệt",
  CONFIRMED: "Không có đặt trước nào đang xác nhận",
  CLOSED:    "Không có đặt trước nào đã đóng",
}[store.adminStatus]));

const handleCancel = async (id) => {
  if (!confirm("Xác nhận huỷ đặt trước này?")) return;
  await store.cancelAdmin(id);
};

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const isExpiringSoon = (iso) => {
  const diff = new Date(iso) - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
};

// Không cần watch — setAdminStatus/setAdminPage đã tự gọi fetchAdmin
onMounted(store.fetchAdmin);
</script>