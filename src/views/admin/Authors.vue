<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Quản lý tác giả</h1>

      <button
        @click="openCreate"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Thêm
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded shadow p-4">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Tên</th>
            <th class="p-2 text-left">Ngày sinh</th>
            <th class="p-2 text-left">Tiểu sử</th>
            <th class="p-2 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="a in authorStore.authors"
            :key="a.id"
            class="border-t"
          >
            <td class="p-2">{{ a.name }}</td>
            <td class="p-2">{{ a.dateOfBirth }}</td>
            <td class="p-2">{{ a.bio }}</td>

            <td class="p-2 flex gap-3">
              <!-- Edit -->
              <button
                @click="openEdit(a)"
                class="text-yellow-500 hover:text-yellow-600"
                title="Sửa"
              >
                <Pencil class="w-5 h-5" />
              </button>

              <!-- Delete -->
              <button
                @click="remove(a.id)"
                class="text-red-500 hover:text-red-600"
                title="Xoá"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add/Edit Author -->
<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

    <!-- Header -->
    <div class="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 flex items-center justify-between gap-3">
      <div>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
          {{ isEdit ? 'Cập nhật tác giả' : 'Thêm mới' }}
        </p>
        <h2 class="text-white text-lg font-bold leading-snug">
          {{ isEdit ? form.name || 'Chỉnh sửa tác giả' : 'Thêm tác giả' }}
        </h2>
      </div>
      <button
        @click="closeModal"
        class="flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-5 space-y-4">

      <div>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Tên tác giả</p>
        <input
          v-model="form.name"
          placeholder="Nhập tên tác giả..."
          class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        />
      </div>

      <div>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Ngày sinh</p>
        <input
          v-model="form.dateOfBirth"
          type="date"
          class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        />
      </div>

      <div>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Tiểu sử</p>
        <textarea
          v-model="form.bio"
          placeholder="Nhập tiểu sử tác giả..."
          rows="3"
          class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
        />
      </div>

    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
      <button
        @click="closeModal"
        class="text-slate-500 hover:text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-150"
      >
        Huỷ
      </button>
      <button
        @click="save"
        class="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
      >
        {{ isEdit ? 'Cập nhật' : 'Thêm tác giả' }}
      </button>
    </div>

  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthorStore } from "@/stores/authorStore";
import { Pencil, Trash2 } from "lucide-vue-next";

const authorStore = useAuthorStore();

const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = ref({
  name: "",
  dateOfBirth: "",
  bio: "",
});

onMounted(() => {
  authorStore.fetchAuthors();
});

const openCreate = () => {
  isEdit.value = false;
  form.value = {
    name: "",
    dateOfBirth: "",
    bio: "",
  };
  showModal.value = true;
};

const openEdit = (author) => {
  isEdit.value = true;
  currentId.value = author.id;
  form.value = { ...author };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  if (isEdit.value) {
    await authorStore.editAuthor(currentId.value, form.value);
  } else {
    await authorStore.addAuthor(form.value);
  }
  closeModal();
};

const remove = async (id) => {
  if (confirm("Bạn có chắc muốn xoá?")) {
    await authorStore.removeAuthor(id);
  }
};
</script>