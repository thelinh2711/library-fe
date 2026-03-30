<template>
  <div>

    <!-- Heading -->
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-stone-800 tracking-tight" style="font-family:'Lora',serif">
        Sách đã đặt trước
      </h1>
      <p class="text-sm text-stone-400 mt-1">Lịch sử đặt trước và trạng thái hiện tại</p>
    </div>

    <!-- Skeleton -->
    <div v-if="store.loading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4 animate-pulse">
        <div class="w-10 h-10 rounded-xl bg-stone-200 flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3.5 bg-stone-200 rounded-full w-2/5"></div>
          <div class="h-3 bg-stone-200 rounded-full w-1/4"></div>
        </div>
        <div class="h-6 w-20 bg-stone-200 rounded-full"></div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="store.reservations.length === 0" class="flex flex-col items-center py-24 text-center">
      <div class="text-6xl mb-5">🔖</div>
      <h3 class="text-lg font-semibold text-stone-700 mb-1">Chưa có sách nào được đặt trước</h3>
      <p class="text-sm text-stone-400 mb-6">Tìm sách yêu thích và đặt trước ngay!</p>
      <router-link
        to="/student"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Khám phá thư viện
      </router-link>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="r in store.reservations"
        :key="r.id"
        class="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
      >
        <!-- Icon -->
        <div
          class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          :class="iconBg(r.status)"
        >
          <svg class="w-5 h-5" :class="iconColor(r.status)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-stone-800 truncate">{{ r.bookTitle }}</p>
          <div class="flex items-center gap-3 mt-0.5 flex-wrap">
            <span class="text-xs text-stone-400">
              Đặt lúc {{ fmtDate(r.reservedAt) }}
            </span>
            <span v-if="r.expiredAt" class="text-xs text-stone-400">
              Hết hạn {{ fmtDate(r.expiredAt) }}
            </span>
          </div>
        </div>

        <!-- Status badge -->
        <span
          class="flex-shrink-0 text-[11px] font-bold px-3 py-1 rounded-full"
          :class="badgeClass(r.status)"
        >
          {{ statusLabel(r.status) }}
        </span>

        <!-- Cancel button — chỉ hiện khi PENDING -->
        <button
          v-if="r.status === 'PENDING'"
          :disabled="store.submitting"
          @click="confirmCancel(r)"
          class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Huỷ
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.totalPages > 1" class="mt-8 flex items-center justify-center gap-1.5">
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
    </div>

    <!-- Confirm cancel dialog -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="cancelTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="cancelTarget = null">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="text-base font-bold text-stone-800 mb-1">Huỷ đặt trước?</h3>
              <p class="text-sm text-stone-500">
                Bạn chắc chắn muốn huỷ đặt trước cuốn
                <span class="font-semibold text-stone-700">{{ cancelTarget?.bookTitle }}</span>?
              </p>
            </div>
            <div class="flex gap-2.5">
              <button
                @click="cancelTarget = null"
                class="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold transition-colors"
              >
                Không
              </button>
              <button
                :disabled="store.submitting"
                @click="doCancel"
                class="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="store.submitting">Đang huỷ...</span>
                <span v-else>Xác nhận huỷ</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservationStore'

const store       = useReservationStore()
const cancelTarget = ref(null)

// ── Pagination ──
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

// ── Status helpers ──
const STATUS_MAP = {
  PENDING:   { label: 'Đang chờ',    badge: 'bg-amber-100 text-amber-700',   iconBg: 'bg-amber-50',  iconColor: 'text-amber-500'  },
  CONFIRMED: { label: 'Đã xác nhận', badge: 'bg-blue-100 text-blue-700',     iconBg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
  CANCELLED: { label: 'Đã huỷ',      badge: 'bg-stone-100 text-stone-500',   iconBg: 'bg-stone-50',  iconColor: 'text-stone-400'  },
  EXPIRED:   { label: 'Hết hạn',     badge: 'bg-red-100 text-red-600',       iconBg: 'bg-red-50',    iconColor: 'text-red-400'    },
  COMPLETED: { label: 'Hoàn thành',  badge: 'bg-emerald-100 text-emerald-700', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
}

const statusLabel = (s) => STATUS_MAP[s]?.label   ?? s
const badgeClass  = (s) => STATUS_MAP[s]?.badge   ?? 'bg-stone-100 text-stone-500'
const iconBg      = (s) => STATUS_MAP[s]?.iconBg  ?? 'bg-stone-50'
const iconColor   = (s) => STATUS_MAP[s]?.iconColor ?? 'text-stone-400'

function fmtDate(dt) {
  if (!dt) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dt))
}

// ── Cancel flow ──
function confirmCancel(r) {
  cancelTarget.value = r
}

async function doCancel() {
  await store.cancel(cancelTarget.value.id)
  cancelTarget.value = null
}

onMounted(() => {
  store.page = 0
  store.fetchMy()
})
</script>