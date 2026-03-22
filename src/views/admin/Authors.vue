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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500/20 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl mb-4">
          {{ isEdit ? "Sửa" : "Thêm" }} tác giả
        </h2>

        <input
          v-model="form.name"
          placeholder="Tên tác giả"
          class="w-full border px-3 py-2 mb-3"
        />

        <input
          v-model="form.dateOfBirth"
          type="date"
          class="w-full border px-3 py-2 mb-3"
        />

        <textarea
          v-model="form.bio"
          placeholder="Tiểu sử"
          class="w-full border px-3 py-2 mb-4"
        />

        <div class="flex justify-end gap-2">
          <button @click="closeModal">Huỷ</button>

          <button
            @click="save"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
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