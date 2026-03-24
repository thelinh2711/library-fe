<!-- src/components/book/BookTable.vue -->
<template>
  <div class="bg-white rounded shadow p-4">
    <table class="w-full">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Ảnh</th>
          <th class="p-2 text-left">Tiêu đề</th>
          <th class="p-2 text-left">NXB</th>
          <th class="p-2 text-left">Năm</th>
          <th class="p-2 text-left">ISBN</th>
          <th class="p-2 text-left">Số lượng</th>
          <th class="p-2 text-left">Sẵn có</th>
          <th class="p-2 text-left">Mô tả</th>
          <th class="p-2 text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in books" :key="b.id" class="border-t">
          <td class="p-2">
            <img
              v-if="b.imageUrl"
              :src="b.imageUrl"
              alt="cover"
              class="w-10 h-14 object-cover rounded shadow-sm"
            />
            <div
              v-else
              class="w-10 h-14 bg-slate-100 rounded flex items-center justify-center text-slate-300"
            >
              <BookOpen class="w-5 h-5" />
            </div>
          </td>
          <td class="p-2">{{ b.title }}</td>
          <td class="p-2">{{ b.publisher }}</td>
          <td class="p-2">{{ b.publishYear }}</td>
          <td class="p-2">{{ b.isbn }}</td>
          <td class="p-2">{{ b.quantity }}</td>
          <td class="p-2">{{ b.availableQuantity }}</td>
          <td class="p-2 max-w-[160px] truncate">{{ b.description }}</td>
          <td class="p-2 align-middle">
            <div class="flex gap-2 items-center">
            <button @click="$emit('view', b.id)" class="text-blue-500 hover:text-blue-600" title="Xem chi tiết">
              <Eye class="w-5 h-5" />
            </button>
            <button @click="$emit('edit', b)" class="text-yellow-500 hover:text-yellow-600" title="Sửa">
              <Pencil class="w-5 h-5" />
            </button>
            <button @click="$emit('remove', b.id)" class="text-red-500 hover:text-red-600" title="Xoá">
              <Trash2 class="w-5 h-5" />
            </button>
            </div>
          </td>
        </tr>
        <tr v-if="!books.length">
          <td colspan="9" class="text-center py-10 text-slate-400">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-end gap-2 mt-4">
      <button
        :disabled="page === 0"
        @click="$emit('page-change', page - 1)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span class="px-3 py-1">{{ page + 1 }} / {{ totalPages }}</span>
      <button
        :disabled="page + 1 >= totalPages"
        @click="$emit('page-change', page + 1)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { Eye, Pencil, Trash2, BookOpen } from "lucide-vue-next";

defineProps({
  books: { type: Array, default: () => [] },
  page: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 },
});

defineEmits(["view", "edit", "remove", "page-change"]);
</script>