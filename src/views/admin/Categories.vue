<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Quản lý thể loại</h1>

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
            <th class="p-2 text-left">Mô tả</th>
            <th class="p-2 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="c in categoryStore.categories"
            :key="c.id"
            class="border-t"
          >
            <td class="p-2">{{ c.name }}</td>
            <td class="p-2">{{ c.description }}</td>

            <td class="p-2 flex gap-3">
            <!-- Edit -->
            <button
                @click="openEdit(c)"
                class="text-yellow-500 hover:text-yellow-600"
                title="Sửa"
            >
                <Pencil class="w-5 h-5" />
            </button>

            <!-- Delete -->
            <button
                @click="remove(c.id)"
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
          {{ isEdit ? "Sửa" : "Thêm" }} thể loại
        </h2>

        <input
          v-model="form.name"
          placeholder="Tên thể loại"
          class="w-full border px-3 py-2 mb-3"
        />

        <textarea
          v-model="form.description"
          placeholder="Mô tả"
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
import { onMounted, reactive, ref } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { Pencil, Trash2 } from "lucide-vue-next";

const categoryStore = useCategoryStore();

const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = reactive({
  name: "",
  description: "",
});

// load data
onMounted(() => {
  categoryStore.fetchCategories();
});

const openCreate = () => {
  isEdit.value = false;
  form.name = "";
  form.description = "";
  showModal.value = true;
};

const openEdit = (c) => {
  isEdit.value = true;
  currentId.value = c.id;
  form.name = c.name;
  form.description = c.description;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  if (isEdit.value) {
    await categoryStore.editCategory(currentId.value, form);
  } else {
    await categoryStore.addCategory(form);
  }
  closeModal();
};

const remove = async (id) => {
  if (confirm("Xoá thể loại này?")) {
    await categoryStore.removeCategory(id);
  }
};
</script>