<!-- src/views/admin/Students.vue -->
<template>
  <div class="flex flex-col gap-5">

    <!-- Page header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Quản lý Sinh viên</h1>
        <p class="text-sm text-slate-400 mt-0.5">{{ total }} sinh viên trong hệ thống</p>
      </div>
      <div class="flex gap-2">
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
          @click="showImport = true"
        >
          <FileSpreadsheet class="h-4 w-4" /> Import Excel
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-200 hover:opacity-90 transition"
          @click="openCreate"
        >
          <Plus class="h-4 w-4" /> Thêm sinh viên
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-slate-100 shadow-sm">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.iconBg]">
          <component :is="stat.icon" :class="['h-4 w-4', stat.iconColor]" />
        </div>
        <div>
          <p class="text-lg font-bold text-slate-800 leading-none">{{ stat.value }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4">
      <StudentSearchBar @search="onSearch" />
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      <!-- Table toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-50">
        <p class="text-xs text-slate-500">
          Hiển thị <span class="font-semibold text-slate-700">{{ students.length }}</span> / {{ total }} kết quả
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">Sắp xếp:</span>
          <select
            v-model="store.searchParams.sortBy"
            class="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-400 bg-white"
            @change="store.setSearch({})"
          >
            <option value="fullName">Tên</option>
            <option value="studentCode">MSSV</option>
            <option value="courseYear">Khóa</option>
          </select>
          <button
            class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-500 transition"
            @click="toggleSortDir"
          >
            <ArrowUpDown class="h-3 w-3" />
            {{ store.searchParams.sortDir === 'asc' ? 'A → Z' : 'Z → A' }}
          </button>
        </div>
      </div>

      <StudentTable :students="students" :loading="loading" @edit="openEdit" @delete="openDelete" @view="openEdit" />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 px-5 py-3.5 border-t border-slate-50">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
          :disabled="currentPage === 0"
          @click="store.setPage(currentPage - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <button
          v-for="p in pageNumbers" :key="p"
          :class="[
            'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition',
            p === '…' ? 'text-slate-400 cursor-default border-transparent' :
            p === currentPage + 1
              ? 'bg-indigo-500 text-white border border-indigo-500'
              : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500'
          ]"
          :disabled="p === '…'"
          @click="p !== '…' && store.setPage(p - 1)"
        >{{ p }}</button>

        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
          :disabled="currentPage === totalPages - 1"
          @click="store.setPage(currentPage + 1)"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Modals -->
    <StudentFormModal
      :show="showForm" :student="editTarget"
      :submitting="formSubmitting" :api-error="formError"
      @close="showForm = false" @submit="onFormSubmit"
    />
    <StudentImportModal
      :show="showImport"
      :submitting="importSubmitting" :api-error="importError"
      @close="showImport = false" @import="onImport"
    />
    <StudentDeleteModal
      :show="showDelete" :student="deleteTarget"
      :submitting="deleteSubmitting"
      @close="showDelete = false" @confirm="onDeleteConfirm"
    />

    <!-- Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-3"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl',
          toast.type === 'success' ? 'bg-slate-900 text-emerald-400' : 'bg-rose-50 text-rose-600 border border-rose-200'
        ]"
      >
        <CheckCircle v-if="toast.type === 'success'" class="h-4 w-4" />
        <AlertCircle v-else class="h-4 w-4" />
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  Plus, FileSpreadsheet, Users, UserCheck, UserX,
  ArrowUpDown, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle,
} from "lucide-vue-next";

import { useStudentStore } from "@/stores/studentStore";
import StudentSearchBar   from "@/components/admin/student/StudentSearchBar.vue";
import StudentTable       from "@/components/admin/student/StudentTable.vue";
import StudentFormModal   from "@/components/admin/student/StudentFormModal.vue";
import StudentImportModal from "@/components/admin/student/StudentImportModal.vue";
import StudentDeleteModal from "@/components/admin/student/StudentDeleteModal.vue";

const store = useStudentStore();

const students    = computed(() => store.students);
const total       = computed(() => store.total);
const loading     = computed(() => store.loading);
const currentPage = computed(() => store.searchParams.page);
const totalPages  = computed(() => Math.ceil(total.value / store.searchParams.size) || 1);

const stats = computed(() => [
  { label: "Tổng sinh viên",   value: total.value,
    icon: Users,     iconBg: "bg-indigo-50",  iconColor: "text-indigo-500" },
  { label: "Đang hoạt động",   value: students.value.filter(s => s.status === "ACTIVE").length,
    icon: UserCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  { label: "Ngừng / Khóa",     value: students.value.filter(s => s.status !== "ACTIVE").length,
    icon: UserX,     iconBg: "bg-rose-50",    iconColor: "text-rose-500" },
]);

const pageNumbers = computed(() => {
  const t = totalPages.value, c = currentPage.value + 1;
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
  const pages = [1];
  if (c > 3) pages.push("…");
  for (let p = Math.max(2, c - 1); p <= Math.min(t - 1, c + 1); p++) pages.push(p);
  if (c < t - 2) pages.push("…");
  pages.push(t);
  return pages;
});

const toggleSortDir = () =>
  store.setSearch({ sortDir: store.searchParams.sortDir === "asc" ? "desc" : "asc" });

const onSearch = (params) => store.setSearch(params);

// ── Form modal ──────────────────────────────────────────────────
const showForm       = ref(false);
const editTarget     = ref(null);
const formSubmitting = ref(false);
const formError      = ref("");

const openCreate = () => { editTarget.value = null; formError.value = ""; showForm.value = true; };
const openEdit   = (s) => { editTarget.value = s;   formError.value = ""; showForm.value = true; };

const onFormSubmit = async (data) => {
  formSubmitting.value = true; formError.value = "";
  try {
    editTarget.value ? await store.updateStudent(editTarget.value.id, data) : await store.createStudent(data);
    showForm.value = false;
    showToast("Lưu thành công!", "success");
  } catch (e) {
    formError.value = e?.response?.data?.message ?? "Đã có lỗi xảy ra";
  } finally { formSubmitting.value = false; }
};

// ── Import modal ────────────────────────────────────────────────
const showImport       = ref(false);
const importSubmitting = ref(false);
const importError      = ref("");

const onImport = async (rows) => {
  importSubmitting.value = true; importError.value = "";
  try {
    await store.importStudents(rows);
    showImport.value = false;
    showToast(`Import ${rows.length} sinh viên thành công!`, "success");
  } catch (e) {
    importError.value = e?.response?.data?.message ?? "Import thất bại";
  } finally { importSubmitting.value = false; }
};

// ── Delete modal ────────────────────────────────────────────────
const showDelete       = ref(false);
const deleteTarget     = ref(null);
const deleteSubmitting = ref(false);

const openDelete = (s) => { deleteTarget.value = s; showDelete.value = true; };

const onDeleteConfirm = async () => {
  deleteSubmitting.value = true;
  try {
    await store.deleteStudent(deleteTarget.value.id);
    showDelete.value = false;
    showToast("Đã xóa sinh viên", "success");
  } catch {
    showToast("Xóa thất bại", "error");
  } finally { deleteSubmitting.value = false; }
};

// ── Toast ───────────────────────────────────────────────────────
const toast = ref({ show: false, message: "", type: "success" });
let toastTimer;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  toast.value = { show: true, message, type };
  toastTimer = setTimeout(() => { toast.value.show = false; }, 3000);
};

onMounted(() => store.fetchStudents());
</script>