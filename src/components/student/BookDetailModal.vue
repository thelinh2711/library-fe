<!-- src/components/student/BookDetailModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-3"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          appear
        >
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <!-- Close -->
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Loading state khi đang fetch detail -->
            <div v-if="loading" class="flex flex-col sm:flex-row animate-pulse">
              <div class="sm:w-52 flex-shrink-0 bg-stone-200 sm:rounded-l-2xl" style="min-height: 280px;"/>
              <div class="flex-1 p-7 space-y-4">
                <div class="h-4 bg-stone-200 rounded-full w-1/4"/>
                <div class="h-6 bg-stone-200 rounded-full w-3/4"/>
                <div class="h-4 bg-stone-200 rounded-full w-1/2"/>
                <div class="grid grid-cols-2 gap-3 bg-stone-50 rounded-xl p-4">
                  <div v-for="n in 4" :key="n" class="space-y-1.5">
                    <div class="h-2.5 bg-stone-200 rounded-full w-1/2"/>
                    <div class="h-4 bg-stone-200 rounded-full w-3/4"/>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-2.5 bg-stone-200 rounded-full w-1/4"/>
                  <div class="h-3.5 bg-stone-200 rounded-full w-full"/>
                  <div class="h-3.5 bg-stone-200 rounded-full w-5/6"/>
                  <div class="h-3.5 bg-stone-200 rounded-full w-4/6"/>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div v-else class="flex flex-col sm:flex-row">

              <!-- Cover -->
              <div class="sm:w-52 flex-shrink-0 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center p-8 sm:rounded-l-2xl">
                <div class="w-full">
                  <img
                    v-if="detail.imageUrl"
                    :src="detail.imageUrl"
                    :alt="detail.title"
                    class="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
                  />
                  <div
                    v-else
                    class="w-full aspect-[3/4] rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-6xl font-bold text-indigo-300 select-none" style="font-family:'Lora',serif">
                      {{ detail.title?.charAt(0) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Details -->
              <div class="flex-1 p-7 flex flex-col gap-4 min-w-0">

                <!-- Availability badge -->
                <span
                  class="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold"
                  :class="detail.availableQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="detail.availableQuantity > 0" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  {{ detail.availableQuantity > 0 ? `Còn ${detail.availableQuantity} cuốn` : 'Tạm hết sách' }}
                </span>

                <!-- Title & publisher -->
                <div>
                  <h2 class="text-xl font-bold text-stone-800 leading-snug mb-1" style="font-family:'Lora',serif">
                    {{ detail.title }}
                  </h2>
                  <p class="text-sm text-stone-400">{{ detail.publisher }}</p>
                </div>

                <!-- Info grid -->
                <div class="grid grid-cols-2 gap-3 bg-stone-50 rounded-xl p-4">
                  <div v-if="detail.publishYear">
                    <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Năm XB</p>
                    <p class="text-sm font-medium text-stone-700">{{ detail.publishYear }}</p>
                  </div>
                  <div v-if="detail.isbn">
                    <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">ISBN</p>
                    <p class="text-sm font-mono font-medium text-stone-700">{{ detail.isbn }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Số lượng</p>
                    <p class="text-sm font-medium text-stone-700">{{ detail.availableQuantity }} / {{ detail.quantity }} cuốn</p>
                  </div>
                  <div v-if="detail.price && detail.price > 0">
                    <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Giá bìa</p>
                    <p class="text-sm font-semibold text-blue-600">{{ fmtPrice(detail.price) }}</p>
                  </div>
                </div>

                <!-- Authors -->
                <div v-if="detail.authors?.length">
                  <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Tác giả</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="a in detail.authors"
                      :key="a.authorId ?? a.id"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="a.role === 'MAIN_AUTHOR'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-stone-100 text-stone-600'"
                    >
                      {{ a.authorName ?? a.name }}
                      <span
                        v-if="a.role === 'MAIN_AUTHOR'"
                        class="text-[9px] font-semibold text-blue-400 uppercase"
                      >· chính</span>
                    </span>
                  </div>
                </div>

                <!-- Categories -->
                <div v-if="detail.categories?.length">
                  <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Thể loại</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="c in detail.categories"
                      :key="c.id"
                      class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"
                    >
                      {{ c.name }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="detail.description">
                  <p class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Mô tả</p>
                  <p class="text-sm text-stone-600 leading-relaxed" :class="descExpanded ? '' : 'line-clamp-4'">
                    {{ detail.description }}
                  </p>
                  <button
                    v-if="isDescLong"
                    @click="descExpanded = !descExpanded"
                    class="mt-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                  >
                    {{ descExpanded ? 'Thu gọn ↑' : 'Xem thêm ↓' }}
                  </button>
                </div>

                <!-- Actions -->
                <div class="flex gap-2.5 mt-auto pt-1">
                  <button
                    :disabled="detail.availableQuantity <= 0 || reservationStore.submitting"
                    @click="handleReserve"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed"
                    :class="detail.availableQuantity > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 disabled:opacity-60'
                      : 'bg-stone-100 text-stone-400'"
                  >
                    <svg v-if="reservationStore.submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                    {{ detail.availableQuantity > 0 ? 'Đặt trước sách' : 'Hết sách' }}
                  </button>
                  <button
                    @click="$emit('close')"
                    class="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold transition-colors"
                  >
                    Đóng
                  </button>
                </div>

              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservationStore'
import { getBookDetail } from '@/services/bookService'  // ← thêm import này

const props            = defineProps({ book: { type: Object, required: true } })
const emit             = defineEmits(['close'])
const reservationStore = useReservationStore()

// ── State ─────────────────────────────────────────────────────
const loading     = ref(false)
const detail      = ref({ ...props.book })   // fallback ngay bằng data card
const descExpanded = ref(false)

// Chỉ hiện nút "xem thêm" nếu description > ~200 ký tự
const isDescLong = computed(() => (detail.value.description?.length ?? 0) > 200)

// ── Fetch full detail (có authors + categories) ────────────────
onMounted(async () => {
  // Nếu đã có đủ thông tin (từ list đã embed authors/categories) thì bỏ qua
  if (props.book.authors !== undefined && props.book.categories !== undefined) return

  loading.value = true
  try {
    const res = await getBookDetail(props.book.id)
    // Tuỳ cấu trúc response của bạn, điều chỉnh đường dẫn nếu cần
    detail.value = res.data.result ?? res.data
  } catch (err) {
    console.error('Không thể tải chi tiết sách:', err)
    // Giữ nguyên data từ card, không crash modal
  } finally {
    loading.value = false
  }
})

// ── Reserve ───────────────────────────────────────────────────
async function handleReserve() {
  const ok = await reservationStore.reserve(detail.value.id)
  if (ok) emit('close')
}

// ── Format ────────────────────────────────────────────────────
function fmtPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
</script>