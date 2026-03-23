<!-- src/components/book/BookDetailModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Chi tiết sách</p>
            <h2 class="text-white text-lg font-bold leading-snug">{{ book?.title }}</h2>
          </div>
          <button
            @click="$emit('close')"
            class="flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto max-h-[65vh] px-6 py-5 space-y-4">

        <!-- Cover image -->
        <div v-if="book?.imageUrl" class="flex justify-center">
          <img
            :src="book.imageUrl"
            alt="cover"
            class="h-40 rounded-xl object-cover shadow-md"
          />
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-slate-400 text-xs font-medium mb-0.5">Nhà xuất bản</p>
            <p class="text-slate-800 text-sm font-semibold">{{ book?.publisher || '—' }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-slate-400 text-xs font-medium mb-0.5">Năm xuất bản</p>
            <p class="text-slate-800 text-sm font-semibold">{{ book?.publishYear || '—' }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-slate-400 text-xs font-medium mb-0.5">ISBN</p>
            <p class="text-slate-800 text-sm font-semibold font-mono">{{ book?.isbn || '—' }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-slate-400 text-xs font-medium mb-0.5">Tổng số lượng</p>
            <p class="text-slate-800 text-sm font-semibold">{{ book?.quantity ?? '—' }}</p>
          </div>
        </div>

        <!-- Available Quantity Badge -->
        <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <div class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <p class="text-sm text-slate-600">Số lượng sẵn có:</p>
          <p class="ml-auto text-emerald-700 font-bold text-sm">{{ book?.availableQuantity ?? '—' }}</p>
        </div>

        <!-- Description -->
        <div v-if="book?.description">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Mô tả</p>
          <p class="text-slate-600 text-sm leading-relaxed">{{ book.description }}</p>
        </div>

        <!-- Authors -->
        <div v-if="book?.authors?.length">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Tác giả</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(a, index) in book.authors"
              :key="a.id || index"
              class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100"
            >
              {{ a.name }}
              <span class="text-blue-400">· {{ a.role }}</span>
            </span>
          </div>
        </div>

        <!-- Categories -->
        <div v-if="book?.categories?.length">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Thể loại</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(c, index) in book.categories"
              :key="c.id || index"
              class="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-100"
            >
              {{ c.name }}
            </span>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
        <button
          @click="$emit('close')"
          class="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
        >
          Đóng
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  book: { type: Object, default: null },
});

defineEmits(["close"]);
</script>