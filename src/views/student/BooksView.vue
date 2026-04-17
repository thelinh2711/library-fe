<template>
  <div>

    <!-- ── Page heading ── -->
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-stone-800 tracking-tight" style="font-family:'Lora',serif">
        Khám phá thư viện
      </h1>
      <p class="text-sm text-stone-400 mt-1">
        {{ store.books.length > 0 ? `${store.books.length} đầu sách đang có sẵn` : 'Đang tải...' }}
      </p>
    </div>

    <!-- ── Toolbar ── -->
    <div class="bg-white rounded-2xl border border-stone-200 shadow-sm px-5 py-4 mb-7 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="store.keyword"
          type="text"
          placeholder="Tìm theo tên sách, tác giả..."
          class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
          @keyup.enter="doSearch"
        />
        <button
          v-if="store.keyword"
          @click="store.keyword = ''; doSearch()"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <CategoryFilterDropdown v-model="store.category" @change="doSearch" />

      <select
        v-model="store.sort"
        @change="doSearch"
        class="px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50 text-stone-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer"
      >
        <option value="ASC">Tên A → Z</option>
        <option value="DESC">Tên Z → A</option>
      </select>

      <button
        @click="doSearch"
        class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        Tìm kiếm
      </button>
    </div>

    <!-- ── Skeleton ── -->
    <div v-if="store.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      <div v-for="n in store.size" :key="n" class="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
        <div class="aspect-[3/4] bg-stone-200"></div>
        <div class="p-3.5 space-y-2">
          <div class="h-3 bg-stone-200 rounded-full w-4/5"></div>
          <div class="h-3 bg-stone-200 rounded-full w-3/5"></div>
          <div class="h-3 bg-stone-200 rounded-full w-2/5"></div>
        </div>
      </div>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="store.books.length === 0" class="flex flex-col items-center py-24 text-center">
      <div class="text-6xl mb-5">📚</div>
      <h3 class="text-lg font-semibold text-stone-700 mb-1">Không tìm thấy sách nào</h3>
      <p class="text-sm text-stone-400 mb-6">Thử thay đổi từ khoá hoặc bộ lọc</p>
      <button @click="resetSearch" class="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-xl transition-colors">
        Xoá bộ lọc
      </button>
    </div>

    <!-- ── Book grid ── -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      <div
        v-for="book in store.books"
        :key="book.id"
        @click="selected = book"
        class="group bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/70 transition-all duration-200"
      >
        <!-- Cover -->
        <div class="relative aspect-[3/4] bg-stone-100 overflow-hidden">
          <img
            v-if="book.imageUrl"
            :src="book.imageUrl"
            :alt="book.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="e => e.target.style.display='none'"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
          >
            <span class="text-5xl font-bold text-indigo-300 select-none" style="font-family:'Lora',serif">
              {{ book.title?.charAt(0) }}
            </span>
          </div>

          <!-- Badge trạng thái — ưu tiên: đang mượn > đặt trước > còn/hết sách -->
          <span
            class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="badgeClass(book)"
          >
            {{ badgeText(book) }}
          </span>
        </div>

        <!-- Info -->
        <div class="p-3.5">
          <h3 class="text-[13px] font-semibold text-stone-800 leading-snug line-clamp-2 mb-1">
            {{ book.title }}
          </h3>
          <p class="text-[11px] text-stone-400 truncate mb-2">{{ book.publisher }}</p>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span v-if="book.publishYear" class="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
              {{ book.publishYear }}
            </span>
            <span class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
              {{ book.availableQuantity }}/{{ book.quantity }} cuốn
            </span>
          </div>
          <p v-if="book.price" class="mt-2 text-[13px] font-bold text-blue-600">
            {{ fmtPrice(book.price) }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Pagination ── -->
    <div v-if="store.totalPages > 1" class="mt-10 flex items-center justify-center gap-1.5">
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

      <span class="ml-3 text-xs text-stone-400">
        Trang {{ store.page + 1 }} / {{ store.totalPages }}
      </span>
    </div>

    <!-- ── Detail Modal ── -->
    <BookDetailModal
      v-if="selected"
      :book="selected"
      :my-status="statusStore.statusOf(selected.id)"
      :reservation-id="statusStore.getReservationId(selected.id)"
      @close="selected = null"
      @reserved="onReserved"
      @cancelled="onCancelled"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBookStore }            from '@/stores/bookStore'
import { useStudentBookStatusStore } from '@/stores/studentBookStatusStore'
import BookDetailModal             from '@/components/student/BookDetailModal.vue'
import CategoryFilterDropdown      from '@/components/student/CategoryFilterDropdown.vue'

const store       = useBookStore()
const statusStore = useStudentBookStatusStore()
const selected    = ref(null)

// ── Badge logic ───────────────────────────────────────────────
// Ưu tiên: đang mượn > đặt trước > còn sách > hết sách

const badgeText = (book) => {
  const s = statusStore.statusOf(book.id)
  if (s === 'BORROWING') return 'Đang mượn'
  if (s === 'RESERVED')  return 'Đã đặt trước'
  return book.availableQuantity > 0 ? 'Còn sách' : 'Hết sách'
}

const badgeClass = (book) => {
  const s = statusStore.statusOf(book.id)
  if (s === 'BORROWING') return 'bg-blue-100 text-blue-700'
  if (s === 'RESERVED')  return 'bg-violet-100 text-violet-700'
  return book.availableQuantity > 0
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-red-100 text-red-600'
}

// ── Pagination ────────────────────────────────────────────────
const visiblePages = computed(() => {
  const total = store.totalPages, cur = store.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages = [0]
  if (cur > 2) pages.push('...')
  for (let i = Math.max(1, cur - 1); i <= Math.min(total - 2, cur + 1); i++) pages.push(i)
  if (cur < total - 3) pages.push('...')
  pages.push(total - 1)
  return pages
})

// ── Search ────────────────────────────────────────────────────
function doSearch() {
  store.page = 0
  store.fetchBooks()
}

function resetSearch() {
  store.keyword  = ''
  store.category = ''
  store.sort     = 'ASC'
  store.page     = 0
  store.fetchBooks()
}

// ── Callbacks từ BookDetailModal ──────────────────────────────
function onReserved({ bookId, reservationId }) {
  statusStore.markReserved(bookId, reservationId)
}

function onCancelled(bookId) {
  statusStore.markCancelled(bookId)
}

// ── Utils ─────────────────────────────────────────────────────
function fmtPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(() => {
  store.size = 12
  store.page = 0
  store.fetchBooks()
  statusStore.fetchMyStatuses() // fetch song song, không block grid
})

onBeforeUnmount(() => {
  store.size = 10
})
</script>