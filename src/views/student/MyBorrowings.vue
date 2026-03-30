<template>
  <div>

    <!-- Heading -->
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-stone-800 tracking-tight" style="font-family:'Lora',serif">
        Sách đang mượn
      </h1>
      <p class="text-sm text-stone-400 mt-1">
        {{ store.totalElements > 0 ? `${store.totalElements} phiếu mượn` : 'Lịch sử mượn sách của bạn' }}
      </p>
    </div>

    <!-- Skeleton -->
    <div v-if="store.loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-stone-200 p-5 animate-pulse space-y-3">
        <div class="flex gap-3 items-center">
          <div class="w-9 h-9 rounded-xl bg-stone-200"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-stone-200 rounded-full w-1/3"></div>
            <div class="h-2.5 bg-stone-200 rounded-full w-1/4"></div>
          </div>
          <div class="h-6 w-20 bg-stone-200 rounded-full"></div>
        </div>
        <div class="h-px bg-stone-100"></div>
        <div class="flex gap-3 items-center pl-2">
          <div class="w-7 h-7 rounded-lg bg-stone-200"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-stone-200 rounded-full w-2/5"></div>
            <div class="h-2.5 bg-stone-200 rounded-full w-1/4"></div>
          </div>
          <div class="h-5 w-16 bg-stone-200 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="store.records.length === 0" class="flex flex-col items-center py-24 text-center">
      <div class="text-6xl mb-5">📖</div>
      <h3 class="text-lg font-semibold text-stone-700 mb-1">Chưa có lịch sử mượn sách</h3>
      <p class="text-sm text-stone-400 mb-6">Khám phá thư viện và đặt trước sách ngay!</p>
      <router-link
        to="/student"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Khám phá thư viện
      </router-link>
    </div>

    <!-- Records list -->
    <div v-else class="space-y-4">
      <div
        v-for="record in store.records"
        :key="record.id"
        class="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Record header -->
        <div class="flex items-center gap-3 px-5 py-3.5 bg-stone-50/70 border-b border-stone-100">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="recordIconBg(record.status)"
          >
            <svg class="w-4 h-4" :class="recordIconColor(record.status)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-mono text-stone-400">
              Phiếu #{{ record.id.slice(0, 8).toUpperCase() }}
            </p>
            <p class="text-xs text-stone-500 mt-0.5">
              Mượn lúc {{ fmtDatetime(record.borrowedAt) }}
            </p>
          </div>
          <span
            class="text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0"
            :class="recordBadge(record.status)"
          >
            {{ recordLabel(record.status) }}
          </span>
        </div>

        <!-- Staff note -->
        <div v-if="record.staffNote" class="flex items-start gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-100">
          <svg class="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
          </svg>
          <p class="text-xs text-amber-700">{{ record.staffNote }}</p>
        </div>

        <!-- Book items -->
        <div class="divide-y divide-stone-100">
          <div
            v-for="item in record.items"
            :key="item.id"
            class="flex items-center gap-4 px-5 py-4"
          >
            <!-- Book icon -->
            <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 space-y-1">
              <p class="text-sm font-semibold text-stone-800 truncate">{{ item.bookTitle }}</p>
              <div class="flex items-center gap-3 flex-wrap">
                <span
                  class="flex items-center gap-1 text-xs"
                  :class="isDue(item) ? 'text-red-500 font-semibold' : 'text-stone-500'"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Hạn trả: {{ fmtDate(item.dueDate) }}
                </span>
                <span v-if="item.returnDate" class="flex items-center gap-1 text-xs text-emerald-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  Đã trả {{ fmtDate(item.returnDate) }}
                </span>
              </div>

              <!-- Fines -->
              <div v-if="item.fines && item.fines.length > 0" class="flex flex-wrap gap-1.5 pt-0.5">
                <span
                  v-for="fine in item.fines"
                  :key="fine.id"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  :class="fine.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
                >
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                  </svg>
                  {{ fmtPrice(fine.amount) }} · {{ fine.paid ? 'Đã nộp' : 'Chưa nộp' }}
                </span>
              </div>
            </div>

            <!-- Right: overdue + item status -->
            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span
                v-if="isDue(item)"
                class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                Quá hạn
              </span>
              <span
                class="text-[11px] font-bold px-2.5 py-1 rounded-full"
                :class="itemBadge(item.status)"
              >
                {{ itemLabel(item.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.totalPages > 1" class="mt-8 flex items-center justify-center gap-1.5">
      <button
        :disabled="store.page === 0"
        @click="store.setPage(store.page - 1)"
        class="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'" class="w-9 h-9 flex items-center justify-center text-stone-400 text-sm">…</span>
        <button
          v-else
          @click="store.setPage(p)"
          class="w-9 h-9 flex items-center justify-center rounded-xl border text-sm font-medium transition-all"
          :class="p === store.page
            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200'
            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'"
        >
          {{ p + 1 }}
        </button>
      </template>

      <button
        :disabled="store.page >= store.totalPages - 1"
        @click="store.setPage(store.page + 1)"
        class="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStudentBorrowStore } from "@/stores/studentBorrowStore";

const store = useStudentBorrowStore();

// ── Pagination ──
const visiblePages = computed(() => {
  const total = store.totalPages, cur = store.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = [0];
  if (cur > 2) pages.push("...");
  for (let i = Math.max(1, cur - 1); i <= Math.min(total - 2, cur + 1); i++) pages.push(i);
  if (cur < total - 3) pages.push("...");
  pages.push(total - 1);
  return pages;
});

// ── Record (phiếu mượn) ──
const RECORD_MAP = {
  BORROWING: { label: "Đang mượn",  badge: "bg-blue-100 text-blue-700",       iconBg: "bg-blue-50",    iconColor: "text-blue-500"    },
  COMPLETED: { label: "Hoàn thành", badge: "bg-emerald-100 text-emerald-700", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  OVERDUE:   { label: "Quá hạn",    badge: "bg-red-100 text-red-600",         iconBg: "bg-red-50",     iconColor: "text-red-500"     },
};
const recordLabel     = (s) => RECORD_MAP[s]?.label     ?? s;
const recordBadge     = (s) => RECORD_MAP[s]?.badge     ?? "bg-stone-100 text-stone-500";
const recordIconBg    = (s) => RECORD_MAP[s]?.iconBg    ?? "bg-stone-50";
const recordIconColor = (s) => RECORD_MAP[s]?.iconColor ?? "text-stone-400";

// ── Item (từng cuốn sách) ──
const ITEM_MAP = {
  BORROWING: { label: "Đang mượn", badge: "bg-blue-100 text-blue-700"         },
  RETURNED:  { label: "Đã trả",    badge: "bg-emerald-100 text-emerald-700"   },
  OVERDUE:   { label: "Quá hạn",   badge: "bg-red-100 text-red-600"           },
  LOST:      { label: "Mất sách",  badge: "bg-orange-100 text-orange-700"     },
};
const itemLabel = (s) => ITEM_MAP[s]?.label ?? s;
const itemBadge = (s) => ITEM_MAP[s]?.badge ?? "bg-stone-100 text-stone-500";

// ── Helpers ──
function isDue(item) {
  if (item.status !== "BORROWING" || !item.dueDate) return false;
  return new Date(item.dueDate) < new Date();
}

function fmtDatetime(dt) {
  if (!dt) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(dt));
}

function fmtDate(dt) {
  if (!dt) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(dt));
}

function fmtPrice(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

onMounted(() => {
  store.page = 0;
  store.fetchMy();
});
</script>