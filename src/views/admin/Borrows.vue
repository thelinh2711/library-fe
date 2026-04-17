<!-- src/views/admin/Borrows.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 tracking-tight">Mượn sách</h1>
        <p class="text-xs text-slate-400 mt-0.5">Quản lý phiếu mượn và xử lý trả sách</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Filter tabs -->
        <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="store.setStatus(tab.value)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            :class="store.status === tab.value
              ? 'bg-white text-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'"
          >
            {{ tab.label }}
            <span
              v-if="store.status === tab.value && store.totalElements > 0"
              class="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold bg-indigo-100 text-indigo-600"
            >
              {{ store.totalElements }}
            </span>
          </button>
        </div>

        <!-- Ô search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            :value="store.keyword"
            @input="store.setKeyword($event.target.value)"
            placeholder="Tìm theo tên hoặc mã sinh viên…"
            class="h-9 w-64 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
          />
        </div>

        <!-- Tạo phiếu mượn mới -->
        <button
          @click="showForm = true"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          <Plus class="h-3.5 w-3.5" />
          Tạo phiếu mượn
        </button>
      </div>
    </div>

    <!-- Bảng -->
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden p-0">
      <div class="p-0">
        <BorrowTable
          :borrows="store.borrows"
          :loading="store.loading"
          :page="store.page"
          :total-pages="store.totalPages"
          :empty-hint="emptyHint"
          @view="handleView"
          @page-change="store.setPage"
        />
      </div>
    </div>

    <!-- Modal tạo phiếu mượn -->
    <BorrowFormModal
      v-if="showForm"
      :submitting="store.submitting"
      @close="showForm = false"
      @save="handleCreate"
    />

    <!-- Modal chi tiết -->
    <BorrowDetailModal
      v-if="showDetail"
      :record="store.borrowDetail"
      :submitting="store.submitting"
      @close="showDetail = false"
      @return="handleReturn"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Search, Plus } from "lucide-vue-next";
import { useBorrowStore }    from "@/stores/borrowStore";
import BorrowTable           from "@/components/admin/borrow/BorrowTable.vue";
import BorrowFormModal       from "@/components/admin/borrow/BorrowFormModal.vue";
import BorrowDetailModal     from "@/components/admin/borrow/BorrowDetailModal.vue";

const store      = useBorrowStore();
const showForm   = ref(false);
const showDetail = ref(false);

const tabs = [
  { label: "Đang mượn",  value: "BORROWING" },
  { label: "Quá hạn",    value: "OVERDUE"   },
  { label: "Hoàn tất",   value: "COMPLETED" },
];

const emptyHint = computed(() => ({
  BORROWING: "Không có phiếu nào đang mượn",
  OVERDUE:   "Không có phiếu nào quá hạn",
  COMPLETED: "Chưa có phiếu nào hoàn tất",
}[store.status]));

const handleView = async (id) => {
  await store.fetchDetail(id);
  showDetail.value = true;
};

const handleCreate = async (payload) => {
  const ok = await store.create(payload);
  if (ok) showForm.value = false;
};

const handleReturn = async (payload) => {
  const ok = await store.processReturn(store.borrowDetail.id, payload);
  if (ok) showDetail.value = false;
};

onMounted(store.fetchBorrows);
</script>