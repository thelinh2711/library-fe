<template>
  <div class="flex flex-col gap-5">

    <!-- Page header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Quản lý Thể loại</h1>
        <p class="text-sm text-slate-400 mt-0.5">{{ categoryStore.totalElements }} thể loại trong hệ thống</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-200 hover:opacity-90 transition"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" /> Thêm thể loại
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      <!-- Toolbar -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
        <p class="text-xs text-slate-500">
          Tổng <span class="font-semibold text-slate-700">{{ categoryStore.totalElements }}</span> thể loại
        </p>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            v-model="keyword"
            type="text"
            placeholder="Tìm thể loại…"
            class="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition w-48"
            @input="onSearch"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="categoryStore.categories.length === 0" class="flex flex-col items-center gap-2 py-16 text-slate-400">
        <Tag class="w-10 h-10 opacity-30" />
        <p class="text-sm font-semibold text-slate-500">Chưa có thể loại nào</p>
        <p class="text-xs">Thêm thể loại đầu tiên</p>
      </div>

      <!-- Table -->
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100">
            <th :class="TH" class="w-8">#</th>
            <th :class="TH" class="cursor-pointer select-none" @click="categoryStore.toggleSort()">
              <div class="flex items-center gap-1">
                Tên thể loại
                <span class="text-slate-300">{{ categoryStore.sortDir === 'asc' ? '↑' : '↓' }}</span>
              </div>
            </th>
            <th :class="TH">Mô tả</th>
            <th :class="[TH, 'text-right']">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(c, index) in categoryStore.categories"
            :key="c.id"
            class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
          >
            <td class="px-4 py-3 text-xs text-slate-400 font-medium">
              {{ categoryStore.page * categoryStore.size + index + 1 }}
            </td>

            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {{ c.name?.[0]?.toUpperCase() ?? '?' }}
                </div>
                <span class="font-medium text-slate-700">{{ c.name }}</span>
              </div>
            </td>

            <td class="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">
              {{ c.description || '—' }}
            </td>

            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                  title="Sửa"
                  @click="openEdit(c)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition"
                  title="Xóa"
                  @click="remove(c.id)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="categoryStore.totalPages > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-50">
        <p class="text-xs text-slate-400">
          Trang <span class="font-semibold text-slate-600">{{ categoryStore.page + 1 }}</span>
          / {{ categoryStore.totalPages }}
        </p>
        <div class="flex gap-1.5">
          <button
            class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            :disabled="categoryStore.page === 0"
            @click="categoryStore.goToPage(categoryStore.page - 1)"
          >
            Trước
          </button>
          <button
            class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            :disabled="categoryStore.last"
            @click="categoryStore.goToPage(categoryStore.page + 1)"
          >
            Sau
          </button>
        </div>
      </div>

    </div>

    <!-- Modal Add/Edit -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" @click.self="closeModal">
          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            leave-active-class="transition duration-150"
            leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div v-if="showModal" class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Tag class="h-4 w-4 text-white" />
                  </div>
                  <h2 class="text-[15px] font-bold text-slate-800">
                    {{ isEdit ? 'Cập nhật thể loại' : 'Thêm thể loại' }}
                  </h2>
                </div>
                <button class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition" @click="closeModal">
                  <X class="h-4 w-4" />
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-5 flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Tên thể loại <span class="text-rose-400">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Nhập tên thể loại…"
                    :class="[INPUT, !form.name && submitted && 'border-rose-400 focus:ring-rose-100']"
                  />
                  <p v-if="!form.name && submitted" class="text-xs text-rose-500">Không được để trống</p>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Mô tả</label>
                  <textarea
                    v-model="form.description"
                    placeholder="Nhập mô tả thể loại…"
                    rows="3"
                    :class="[INPUT, 'resize-none']"
                  />
                </div>
              </div>

              <!-- Footer -->
              <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button class="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition" @click="closeModal">
                  Hủy
                </button>
                <button
                  class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl hover:opacity-90 transition"
                  @click="save"
                >
                  {{ isEdit ? 'Lưu thay đổi' : 'Thêm thể loại' }}
                </button>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { Plus, Pencil, Trash2, Tag, Search, X } from "lucide-vue-next";

const categoryStore = useCategoryStore();

const keyword   = ref("");
const showModal = ref(false);
const isEdit    = ref(false);
const currentId = ref(null);
const submitted = ref(false);

const form = reactive({ name: "", description: "" });

const TH    = "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap";
const LABEL = "text-xs font-semibold text-slate-500";
const INPUT = "w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-xl bg-white outline-none placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

let debounceTimer = null;
const onSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    categoryStore.search(keyword.value.trim());
  }, 400);
};

onMounted(() => categoryStore.fetchCategories());

const openCreate = () => {
  isEdit.value = false; submitted.value = false;
  form.name = ""; form.description = "";
  showModal.value = true;
};

const openEdit = (c) => {
  isEdit.value = true; submitted.value = false;
  currentId.value = c.id;
  form.name = c.name; form.description = c.description;
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const save = async () => {
  submitted.value = true;
  if (!form.name?.trim()) return;
  isEdit.value
    ? await categoryStore.editCategory(currentId.value, { ...form })
    : await categoryStore.addCategory({ ...form });
  closeModal();
};

const remove = async (id) => {
  if (confirm("Xóa thể loại này?")) await categoryStore.removeCategory(id);
};
</script>