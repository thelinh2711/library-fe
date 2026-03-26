<!-- src/components/book/BookTable.vue -->
<template>
  <!-- Empty state -->
  <div v-if="!loading && books.length === 0" class="flex flex-col items-center gap-2 py-16 text-slate-400">
    <BookOpen class="w-10 h-10 opacity-30" />
    <p class="text-sm font-semibold text-slate-500">Chưa có sách nào</p>
    <p class="text-xs">Thêm mới sách vào hệ thống</p>
  </div>

  <div v-else>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100">
            <th :class="TH">Ảnh</th>
            <th :class="TH">Tiêu đề</th>
            <th :class="TH">Nhà xuất bản</th>
            <th :class="TH">Năm</th>
            <th :class="TH">ISBN</th>
            <th :class="TH">Số lượng</th>
            <th :class="TH">Sẵn có</th>
            <th :class="TH">Giá bìa</th>
            <th :class="TH">Mô tả</th>
            <th :class="[TH, 'text-right']">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton -->
          <template v-if="loading">
            <tr v-for="i in 6" :key="i" class="border-b border-slate-50">
              <td class="px-4 py-3">
                <div class="w-8 h-11 rounded-lg bg-slate-100 animate-pulse" />
              </td>
              <td v-for="j in 8" :key="j" class="px-4 py-3">
                <div class="h-3.5 rounded bg-slate-100 animate-pulse" :style="{ width: j === 1 ? '75%' : '55%' }" />
              </td>
              <td class="px-4 py-3">
                <div class="h-3.5 rounded bg-slate-100 animate-pulse w-16 ml-auto" />
              </td>
            </tr>
          </template>

          <!-- Data -->
          <template v-else>
            <tr
              v-for="b in books"
              :key="b.id"
              class="border-b border-slate-50 hover:bg-slate-50/70 cursor-pointer transition-colors"
              @click="$emit('view', b.id)"
            >
              <!-- Ảnh bìa -->
              <td class="px-4 py-3">
                <img
                  v-if="b.imageUrl"
                  :src="b.imageUrl"
                  alt="cover"
                  class="w-8 h-11 object-cover rounded-lg shadow-sm"
                />
                <div
                  v-else
                  class="w-8 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300"
                >
                  <BookOpen class="w-4 h-4" />
                </div>
              </td>

              <!-- Tiêu đề -->
              <td class="px-4 py-3">
                <span class="font-medium text-slate-700 line-clamp-2 max-w-[200px]">{{ b.title }}</span>
              </td>

              <!-- NXB -->
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ b.publisher || '—' }}</td>

              <!-- Năm -->
              <td class="px-4 py-3 text-slate-500">{{ b.publishYear || '—' }}</td>

              <!-- ISBN -->
              <td class="px-4 py-3 font-mono text-slate-500">{{ b.isbn || '—' }}</td>

              <!-- Số lượng -->
              <td class="px-4 py-3 text-slate-600 text-center">{{ b.quantity ?? '—' }}</td>

              <!-- Sẵn có -->
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[11.5px] font-semibold"
                  :class="b.availableQuantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'"
                >
                  {{ b.availableQuantity ?? '—' }}
                </span>
              </td>

              <!-- Giá bìa -->
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap">
                {{ b.price != null ? formatPrice(b.price) : '—' }}
              </td>

              <!-- Mô tả -->
              <td class="px-4 py-3 text-slate-400 text-xs max-w-[160px] truncate">{{ b.description || '—' }}</td>

              <!-- Thao tác -->
              <td class="px-4 py-3" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                    title="Sửa"
                    @click="$emit('edit', b)"
                  >
                    <Pencil class="h-3.5 w-3.5" />
                  </button>
                  <button
                    class="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition"
                    title="Xóa"
                    @click="$emit('remove', b.id)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
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
        <span class="font-semibold text-slate-600">{{ totalPages }}</span>
      </p>
      <div class="flex items-center gap-1.5">
        <button
          :disabled="page === 0"
          @click="$emit('page-change', page - 1)"
          class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <template v-for="p in pageNumbers" :key="p">
          <span v-if="p === '...'" class="px-1 text-slate-300 text-sm">…</span>
          <button
            v-else
            @click="$emit('page-change', p)"
            class="w-8 h-8 rounded-lg border text-xs font-semibold transition"
            :class="p === page
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
          >
            {{ p + 1 }}
          </button>
        </template>

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
import { computed } from "vue";
import { BookOpen, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  books:      { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false    },
  page:       { type: Number,  default: 0        },
  totalPages: { type: Number,  default: 1        },
});

const emit = defineEmits(["view", "edit", "remove", "page-change", "sort-change"]);

const TH = "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap";

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

// ── Pagination numbers ────────────────────────────────────────
const pageNumbers = computed(() => {
  const total = props.totalPages;
  const current = props.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = [];
  if (current <= 3) {
    pages.push(0, 1, 2, 3, 4, "...", total - 1);
  } else if (current >= total - 4) {
    pages.push(0, "...", total - 5, total - 4, total - 3, total - 2, total - 1);
  } else {
    pages.push(0, "...", current - 1, current, current + 1, "...", total - 1);
  }
  return pages;
});
</script>