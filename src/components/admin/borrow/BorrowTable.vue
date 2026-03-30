<!-- src/components/borrow/BorrowTable.vue -->
<template>
  <!-- Empty -->
  <div v-if="!loading && borrows.length === 0" class="flex flex-col items-center gap-2 py-16 text-slate-400">
    <ClipboardList class="w-10 h-10 opacity-30" />
    <p class="text-sm font-semibold text-slate-500">Không có phiếu mượn nào</p>
    <p class="text-xs">{{ emptyHint }}</p>
  </div>

  <div v-else>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100">
            <th :class="TH">Sinh viên</th>
            <th :class="TH">Số quyển</th>
            <th :class="TH">Ngày mượn</th>
            <th :class="TH">Hạn gần nhất</th>
            <th :class="TH">Trạng thái</th>
            <th :class="TH">Phạt</th>
            <th :class="[TH, 'text-right']">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-slate-50">
              <td v-for="j in 7" :key="j" class="px-4 py-3.5">
                <div class="h-3.5 rounded bg-slate-100 animate-pulse" :style="{ width: j === 1 ? '65%' : '50%' }" />
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <template v-else>
            <tr
              v-for="r in borrows"
              :key="r.id"
              class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
              @click="$emit('view', r.id)"
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

              <!-- Số quyển -->
              <td class="px-4 py-3.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {{ r.items?.length ?? 0 }} quyển
                </span>
              </td>

              <!-- Ngày mượn -->
              <td class="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                {{ formatDate(r.borrowedAt) }}
              </td>

              <!-- Hạn gần nhất -->
              <td class="px-4 py-3.5 text-xs whitespace-nowrap">
                <span :class="isOverdue(r) ? 'text-rose-500 font-semibold' : 'text-slate-500'">
                  {{ nearestDueDate(r) }}
                </span>
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

              <!-- Có fine chưa trả không -->
              <td class="px-4 py-3.5">
                <span v-if="hasUnpaidFine(r)" class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                  <AlertCircle class="w-3 h-3" /> Còn nợ
                </span>
                <span v-else class="text-slate-300 text-xs">—</span>
              </td>

              <!-- Thao tác -->
              <td class="px-4 py-3.5" @click.stop>
                <div class="flex items-center justify-end">
                  <button
                    class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                    title="Xem chi tiết"
                    @click="$emit('view', r.id)"
                  >
                    <Eye class="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4 px-1">
      <p class="text-xs text-slate-400">
        Trang <span class="font-semibold text-slate-600">{{ page + 1 }}</span> /
        <span class="font-semibold text-slate-600">{{ totalPages || 1 }}</span>
      </p>
      <div class="flex items-center gap-1.5">
        <button
          :disabled="page === 0"
          @click="$emit('page-change', page - 1)"
          class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          :disabled="page + 1 >= totalPages"
          @click="$emit('page-change', page + 1)"
          class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClipboardList, Eye, AlertCircle, ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  borrows:    { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false    },
  page:       { type: Number,  default: 0        },
  totalPages: { type: Number,  default: 1        },
  emptyHint:  { type: String,  default: "Không có phiếu mượn nào phù hợp" },
});

defineEmits(["view", "page-change"]);

const TH = "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap";

const statusClass = {
  BORROWING: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-600",
  OVERDUE:   "bg-rose-50 text-rose-500",
};
const statusLabel = {
  BORROWING: "Đang mượn",
  COMPLETED: "Hoàn tất",
  OVERDUE:   "Quá hạn",
};

const initials = (name) => {
  if (!name) return "?";
  const p = name.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name[0].toUpperCase();
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const nearestDueDate = (r) => {
  const borrowing = r.items?.filter((i) => i.status === "BORROWING") ?? [];
  if (!borrowing.length) return "—";
  const nearest = borrowing.reduce((a, b) =>
    new Date(a.dueDate) < new Date(b.dueDate) ? a : b
  );
  return new Date(nearest.dueDate).toLocaleDateString("vi-VN");
};

const isOverdue = (r) =>
  r.items?.some((i) => i.status === "BORROWING" && new Date(i.dueDate) < new Date()) ?? false;

const hasUnpaidFine = (r) =>
  r.items?.some((i) => i.fines?.some((f) => f.paymentStatus === "UNPAID")) ?? false;
</script>